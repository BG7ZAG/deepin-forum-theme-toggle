/*
 * @Autor: Jason
 * @Date: 2021-03-05 12:01:22
 * @LastEditors: Jason
 * @LastEditTime: 2021-03-11 09:29:31
 * @FilePath: /src/js/background.js
 * @description: description
 */

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 只有打开deepin才显示pageAction
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "bbs.deepin.org" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

let tabId = null;

// 上次选择的主题
let lastCss = "";

let tabIds = []

/**
 * 设置主题
 * @param {string} id 主题类型
 */
function setTheme(id, tabId) {
  //   恢复默认
  if (id === "default") {
    if (lastCss) {
      let code = `
				var dom = document.getElementById('${lastCss}');
				if (dom) {
				  document.head.removeChild(dom);
				}`;
      chrome.tabs.executeScript(tabId, { code: code });
    }
  } else {
    lastCss = "__" + id;
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    let code = `var cssPath = '/css/dark.css';
					var temp = document.createElement('link');
					temp.setAttribute('rel', 'stylesheet');
					temp.setAttribute('type', 'text/css');
					temp.setAttribute('id', '__${id}');
					temp.setAttribute("href", chrome.extension.getURL(cssPath))
					document.head.appendChild(temp);`;
    chrome.tabs.executeScript(tabId, { code: code });
  }

  // 保存数据
  chrome.storage.sync.set({ id: id }, function () {
    console.log("保存成功！");
  });
}

/**
 * 初始化
 */
const init = (tabId) => {
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  chrome.storage.sync.get(["id"], function (items) {
    let id = items.id ?? "default";
    setTheme(id, tabId);
  });
};

const reg = /^https\:\/\/bbs\.deepin\.org/
// 监听标签变化
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
  if (info.status == "loading") {
    //   获取当前页面URL
    if (reg.test(tab.url)) {
      if(!tabIds.includes(id)){
        init(id);
        tabIds.push(id)
      }
    }
  }
});

chrome.tabs.onCreated.addListener(function (tab) {
  //检测新标签打开的页面是否为目标页面
  if (reg.test(tab.pendingUrl)) {
    if(!tabIds.includes(tab.id)){
      init(tab.id);
      tabIds.push(tab.id)
    }
  }
});

// 标签移除时移除缓存id
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  if(tabIds.includes(tabId)){
    let idx = tabIds.indexOf(tabId)
    tabIds.splice(idx,1)
  }
});
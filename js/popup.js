/*
 * @Autor: Jason
 * @Date: 2021-03-05 14:13:31
 * @LastEditors: Jason
 * @LastEditTime: 2021-03-05 15:16:08
 * @FilePath: /js/popup.js
 * @description: description
 */

let tabId = null;

// 主题列表
const themeList = ["dark", "dark2"];

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}
getCurrentTabId((id) => {
  tabId = id;
});

let lastCss = "";
$("#themeList .btn").click(function (e) {
  var id = $(this).attr("id");
  console.log(id);
  //   恢复默认
  if (id === "default") {
      console.log(lastCss);
    if (lastCss) {
      let code = `
            var dom = document.getElementById('${lastCss}');
            if (dom) {
              document.head.removeChild(dom);
            }
    `;
      console.log(code);
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
});

// $("#dark").click(() => {
//   //   chrome.tabs.insertCSS(tabId, { file: "css/dark-2.css" });
//   injectCss();
// });

function injectCss(cssPath) {
  cssPath = cssPath || "/css/dark.css";
  var temp = document.createElement("link");
  temp.setAttribute("rel", "stylesheet");
  temp.setAttribute("type", "text/css");
  temp.setAttribute("id", cssPath);
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.setAttribute("href", chrome.extension.getURL(cssPath));

  // temp.onload = function()
  // {
  // 	// 放在页面不好看，执行完后移除掉
  // 	this.parentNode.removeChild(this);
  // };
  document.head.appendChild(temp);
  console.log(11);
}

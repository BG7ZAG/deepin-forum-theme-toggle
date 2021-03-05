/*
 * @Autor: Jason
 * @Date: 2021-03-05 12:01:22
 * @LastEditors: Jason
 * @LastEditTime: 2021-03-05 14:13:20
 * @FilePath: /js/background.js
 * @description: description
 */
chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开deepin才显示pageAction
					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'bbs.deepin.org'}})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});

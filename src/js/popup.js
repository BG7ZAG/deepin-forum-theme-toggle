/*
 * @Autor: Jason
 * @Date: 2021-03-05 14:13:31
 * @LastEditors: Jason
 * @LastEditTime: 2021-03-06 15:04:03
 * @FilePath: /src/js/popup.js
 * @description: description
 */

/**
 * 切换主题点击
 */
$("#themeList .btn").click(function (e) {
  var id = $(this).attr("id");
  var bg = chrome.extension.getBackgroundPage();
  if (bg.setTheme) {
    bg.setTheme(id);
  }
});

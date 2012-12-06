// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
/*chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    console.log('inputChanged: ' + text);
    suggest([
      {content: text + " one", description: "the first one"},
      {content: text + " number two", description: "the second entry"}
    ]);
  });
*/
function createTab( p , fn ){
  chrome.tabs.getSelected( null , function( thisTab ){
        chrome.tabs.create($.extend({
                   index  : thisTab.index+1,
                   url    : chrome.extension.getURL("./help.html")
         } , p , true) , fn);        
 });
}
var APP = 'Chrome.WB';
var UN_OAUTH_ERROE = 2;
// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    // ajax to sina weibo
    $.ajax({
        url     : "http://2.mrhack.sinaapp.com/ajax/do.php"
        ,type   : "POST"
        ,data   : {
            app : APP
            , action : 'send'
            , c : text
        }
        ,dataType   : "json"
        ,success   : function(result){
            // 没有授权，需要从新开一个tab去让用户去授权
            switch(result.error_num) {
              case UN_OAUTH_ERROE:
                createTab({
                  url : result.error_msg
                });
                break;
              case 0:
                break;
              default:
                alert(result.error_msg);  
            }
        }
    });
  });


// get new message from weibo
var interval = setInterval(
  function getUnreadMessage(){
     $.ajax({
          url : "http://2.mrhack.sinaapp.com/ajax/do.php"
          ,type   : "GET"
          ,data   : {
              app : APP
              , action : 'unread'
          }
          ,dataType   : "json"
          ,success    : function(result){
            if( result.error_num == UN_OAUTH_ERROE ){
               clearInterval(interval);
            }
            if(!result.error_num){
               var mention_num = result.cmt 
                  + result.status
                  + result.dm
                  + result.mention_status
                  + result.mention_cmt;
                // show this num on browser action
               mention_num = mention_num || '';
               chrome.browserAction.setBadgeText({text: mention_num + ''});
               chrome.browserAction.setBadgeBackgroundColor({color: mention_num ? '#FF0000' : '#FFFFFF'});
            }
          }
     })
  } , 30000);

chrome.browserAction.onClicked.addListener(function(tab) {
  // 查看所有的tab，是否有新浪微博的tab
  // 如果有，则定位到该tab，否则新打开个tab到新浪微博
  chrome.browserAction.getBadgeText({} ,  function(num){
    num = parseInt(num || 0);
    if( num && num > 0 ){
      createTab({
        url : 'http://weibo.com'
      });
    } else {
      alert('没有新的消息！');
    }
  });
  
});

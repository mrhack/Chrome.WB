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
// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    // ajax to sina weibo
    $.ajax({
        url     : "http://2.mrhack.sinaapp.com/ajax/send.php"//"http://2.mrhack.sinaapp.com/ajax/send.php"
        ,type   : "POST"
        ,data   : {
            c : text
        }
        ,dataType   : "json"
        ,success   : function(result){
            // 没有授权，需要从新开一个tab去让用户去授权
            if(result.error_num == 2){
              createTab({
                url : result.error_msg
              });
            };
        }
    });
  });
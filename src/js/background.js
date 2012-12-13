
// need jquery.js
// need base.js
(function(){
    function createTab( p , fn ){
        chrome.tabs.getSelected( null , function( thisTab ){
            chrome.tabs.create($.extend({
                 index  : thisTab.index+1,
                 url    : chrome.extension.getURL("./help.html")
            } , p , true) , fn);
     });
    }

    var CONFIGS = {
        "success_bg_color" : '#028102'
        ,"error_bg_color"  : '#FF0000'
    }
    var setBadge = function (text , isOk){
        chrome.browserAction.setBadgeText({text: text});

        chrome.browserAction.setBadgeBackgroundColor(
            {color: typeof isOk == 'boolean' ?
                isOk ? CONFIGS.success_bg_color : CONFIGS.error_bg_color
                : isOk}
            );
    }
    // This event is fired with the user accepts the input in the omnibox.
    chrome.omnibox.onInputEntered.addListener(
        function(text) {
            // ajax to sina weibo
            CWB.api.request ( 'send' , {c : text} , 'POST', function(){
                chrome.browserAction.getBadgeText({} ,  function(text){
                    setBadge('OK' , true);

                    setTimeout(function(){
                        setBadge(text , !text || typeof parseInt(text) == 'number');
                    } , 2000);
                });
            }  , function (result , isOauth){
                if(!isOauth){
                    // 没有授权，需要从新开一个tab去让用户去授权
                    createTab({
                        url : result.error_msg
                    });
                } else {
                    alert(result.error_msg);
                }
            });
        });

        // get new message from weibo
        var timer = null;
        (function getUnreadMessage(){
            CWB.api.request (
                'unread'
                , function(result){
                    var mention_num = result.cmt
                            + result.dm
                            + result.mention_status
                            + result.mention_cmt;
                        // show this num on browser action
                     mention_num = mention_num || '';
                     setBadge(mention_num + '' ,
                        mention_num ?
                        CONFIGS.success_bg_color :
                        [0,0,0,0]);
                 }
                , function (result , isOauth){
                    if(!isOauth){
                        setBadge('exp' , false);
                    }
                 }
                , function(result){
                    timer = setTimeout(getUnreadMessage , 30000);
                    window.localStorage.setItem('weibo_unread' , result);
                });
         })();
})();
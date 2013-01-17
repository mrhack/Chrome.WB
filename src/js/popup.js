/*
 * js for popup page
 * @date 2012/12/13
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-37756717-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function(){
    var unread_config = {
        'status' : {
            text    : '{num}条新微博'
            , url   : '/'
        }
        ,'follower' : {
            text    : '{num}个新粉丝'
            , url   : '/{uid}/myfans/'
        }
        ,'cmt' : {
            text    : '{num}条新评论'
            , url   : '/comment/inbox'
        }
        ,'dm' : {
            text    : '{num}条新私信'
            , url   : '/messages'
        }
        ,'mention_status' : {
            text    : '{num}条@我的微博'
            , url   : '/at/weibo'
        }
        ,'mention_cmt' : {
            text    : '{num}条@我的评论'
            , url   : '/at/comment'
        }
    }
    var $wrap = $('#container');
    // render result
    var renderUnread = function(result) {
        var aHtml   = ['<ul>'];
        var itemTpl = '<li><a href="http://weibo.com/{url}" target="_blank">{text}</a></li>';
        var format  = CWB.util.format;
        var total   = 0;
        for(var key in result){
            if(unread_config[key] && result[key] > 0){
                total += result[key];
                aHtml.push(format(itemTpl , {
                    'url'   : format(unread_config[key].url , {
                        uid: result.uid
                    })
                    ,'text' : format(unread_config[key].text , {
                        num: result[key]
                    })
                } ));
            }
        }
        aHtml.push('</ul>');

        $wrap.html( total > 0 ?aHtml.join('') : 'no news' ) ;
    }
    CWB.api.request('unread' , function(result){
        renderUnread(result);
    } , function(result , isOauth){
        if(!isOauth){
            $wrap.html('<a href="' + result.error_msg + '" target="_blank">授权已经过期，点我重新授权!</a>');
        }
    });

})();
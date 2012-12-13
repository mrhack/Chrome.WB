/*
 * js for popup page
 * @date 2012/12/13
 */

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
            text    : '{num}@我的评论'
            , url   : '/at/comment'
        }
    }
    var $wrap = $('#container');
    var renderUnread = function(result) {
        var aHtml   = ['<ul>'];
        var itemTpl = '<li><a href="http://weibo.com/{url}" >{text}</a></li>';
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
    });

})();
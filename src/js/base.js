
/*
 * common js function for chrome WB
 * defined global object CWB.
 * CWB contains base api of request and other common functions
 */
;;(function(){
    window.CWB = window.CWB || {};
    // function , get unread weibo status

    var APP             = 'Chrome.WB';
    var UN_OAUTH_ERROE  = 2;
    var AJAX_URL        = "http://2.mrhack.sinaapp.com/ajax/do.php";

    // base ajax request
    var _request = function( action , data , type , success , failure , complete){
        if (typeof data == 'function') {
            return _request(action , {} , 'GET' , data , type , success);
        } else if( typeof type == 'function'){
            return _request(action , data , 'GET' , type , success , failure);
        };

        if( !action ) return;
        // data ready
        data = $.extend(data || {} , {
            app : APP
            , action :action
        } , true );

        $.ajax({
                url : AJAX_URL
                ,type   : type || 'GET'
                ,data   : data
                ,dataType   : "json"
                ,success    : function(result){
                    switch(result.error_num) {
                        case UN_OAUTH_ERROE:
                            failure(result , false);
                            break;
                        case 0:
                            success(result);
                            break;
                        default:
                            failure(result , true);
                    }
                }
                ,error      : failure
                ,complete   : complete
            });
    }
    var _api = {
        request : _request
        , get_unread : function( success ) {
            _request ( 'unread' , success );
        }
    }
    var _util = {
        format : function(string,obj){
            return string.replace(/\{(.*?)\}/g , function($0 , $1){
                return obj[$1] === undefined || obj[$1] === false ? "" : obj[$1];
            });
        }
    }
    $.extend(CWB , {
        api     : _api
        , util  : _util
    });
})();
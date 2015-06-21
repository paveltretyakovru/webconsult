jQuery.cookie = function(name, val, options) {

	if (('localStorage' in window) && window.localStorage !== null && name != 'operator_id' && name != 'ok_autodialog' && name != 'ok_user_name' && name != 'operator_name' && name != 'chat_init' && name != 'ok_visits' && name != 'ok_v_p') { // Если поддерживается localStorage 
		
		if(typeof val != 'undefined'){
		
			if(val === null){ // Удаляем данные из localStorage
				
				localStorage.removeItem(name);
				
			}else{ // Записываем данные
				
				localStorage.setItem(name, val);
				
			}
		}else{ //Отдаем данные
			
			return localStorage.getItem(name);
			
		}
	
	}else{ // Используем куккис
		
		if (typeof val != 'undefined') { // name and val given, set cookie
			options = options || {};
			if (val === null) {
				val = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			// CAUTION: Needed to parenthesize options.path and options.domain
			// in the following expressions, otherwise they evaluate to undefined
			// in the packed version for some reason...
			options.path = '/';
			var path = options.path ? '; path=' + (options.path) : '';
			
			var domain = options.domain ? '; domain=' + (options.domain) : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(val), expires, path, domain, secure].join('');
		} else { // only name given, get cookie
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = jQuery.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	}
};
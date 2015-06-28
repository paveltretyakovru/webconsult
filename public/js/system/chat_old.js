/*
 * Основной файл скриптов для чата...
 */
 
var request = 0;
var ok_scroll;
var ok_get_list = 0;
var back_t = null;
var m_t_int = null;
var s_mess = null;
var s_mess_t = new Array(); //Идентификатор timeouta для системных сообщений
var ok_view_form_t;
var mess_int; //Идентификатор timeouta для сообщений
var mess_interval = 3500; // Интервал получения сообщений
var autodialog_int; //Идентификатор интервала для приглашений
var group_id = 0;
var operator_name = 'Консультант'; // Имя оператора в глобальной переменной, будет перезаписан при подключении к оператору

jQuery('document').ready(function(){

			var settings = {
				showArrows: false,
				autoReinitialise: false,
				animateTo: true,
				animateScroll: true,
				animateDuration: 450
			};
			var element = jQuery('.scroll-pane').jScrollPane(settings);
			ok_scroll = element.data('jsp');
				
//if(choose_qroup && id_autodialog_operator == 0 && !jQuery.cookie("operator_id")){ // Показываем отделы
	
if(choose_qroup && id_autodialog_operator == 0 && !jQuery.cookie("operator_id")){ // Показываем отделы
	if(!a_choose_qroup || (a_choose_qroup && choose_qroup_a)){
		
		jQuery('.ok_select_background').click(function(){
			jQuery('#ok_select_select').slideToggle(200);
		});
		
		jQuery('#ok_select_select li').click(function(){
			jQuery('#ok_group_select span').text(jQuery(this).text());
			group_id = jQuery(this).attr('id');
			jQuery('#ok_select_select').css('display', 'none');
		});
		
		jQuery('#ok_main').css('display', 'none');
		jQuery('#ok_loading').css('display', 'none');
		
		jQuery('#ok_group').css('display', 'block');
		
		jQuery('#ok_group_user_name').focus(function(){if(jQuery('#ok_group_user_name').val() == "Ваше имя") jQuery('#ok_group_user_name').val("");});
		jQuery('#ok_group_user_name').blur(function(){if(jQuery.trim(jQuery('#ok_group_user_name').val()) == "") jQuery('#ok_group_user_name').val("Ваше имя");});
		
		jQuery('#ok_group_submit').click(function(){
			
			jQuery('.not_filled').each(function(){
				jQuery(this).removeClass('not_filled');
			});
			
			var new_guest_name = jQuery('#ok_group_user_name').val(); //New name
			jQuery('#ok_user_name').val(new_guest_name);
			jQuery('#ok_new_name').val(new_guest_name);
			jQuery.cookie('ok_user_name', new_guest_name, {expires: 31});
			
			if(choose_qroup_name){
				if(jQuery('#ok_group_user_name').val()== '' || jQuery('#ok_group_user_name').val() == "Ваше имя"){
					jQuery('#ok_group_message').text('Введите ваше имя');
					jQuery('#ok_group_user_name').focus();
					jQuery('#ok_user_name_input').addClass('not_filled');
					return false;
				}
			}
			if(group_id == 0){
				jQuery('#ok_group_message').text('Выберите отдел');
				jQuery('#ok_group_select').addClass('not_filled');
				return false;
			}
			  
			if(jQuery.trim(jQuery("#ok_group_textarea").val()) == '' || jQuery("#ok_group_textarea").val() == "Текст вашего сообщения"){
				jQuery('#ok_group_message').text('Введите текст сообщения');
				jQuery("#ok_group_textarea").focus();
				jQuery('#ok_group_textarea').addClass('not_filled');
				return false;
			}
			
			connection();
			
			jQuery('#ok_main').css('display', 'block');
			jQuery('#ok_loading').css('display', 'block');
		
			jQuery('#ok_group').css('display', 'none');
				
		});
	}else{
		connection();
	}
	
}else{
	connection();
}
soundButton(); //Кнопка для управления звуком

if(jQuery.cookie('ok_user_name')){ //Берем имя из cookie и вставляем в форму для имени

    var ok_user_name = jQuery.cookie('ok_user_name');
    jQuery('#ok_user_name').val(ok_user_name);
}


//Клавитура
jQuery('body').bind('keydown', function(e) {
    //On Esc
    if (e.keyCode == 27) {
        setTyping(0);
        //Свернуть окно чата
        hideChat();
    }
	
	if(e.keyCode == 13){ // На F5
        
    }
});
jQuery('#masseg_olya_send textarea').bind('keydown', function(e) {
	//On Enter
    if(e.keyCode == 13){
        sendmess();
		return false;
    }
});
jQuery('#ok_enter').click(sendmess); //При нажатии на кнопку отправить...
jQuery('#ok_close').click(closeChat);
jQuery('#ok_sound').click(ok_mute);

jQuery('.ok_turn_off').click(function(){
	hideChat();
	jQuery('#ok_button').removeClass('ok_chat_show');
});

//Запускаем интервал для сообщений если не запушено
if(jQuery.cookie('chat_init') == '1'){
    getNewMess(); //Запускаекм интервал для получения сообщений
}

jQuery('#masseg_olya_send textarea').bind('keydown', function(e){
	if(e.keyCode == 32){ // Пробел
		setTyping(1);
	}
});

jQuery('#masseg_olya_send textarea').bind('blur', function(){
    setTyping(0);
});


var guest_old_name = jQuery('#ok_user_name').val();
jQuery('#ok_new_name').val(guest_old_name);

if(jQuery.cookie('ok_user_name') != undefined ) jQuery('#ok_group_user_name').val(jQuery.cookie('ok_user_name'));

//События на кнопки

$('body').on('click' , '#ok_send_dialog' , function(){
	hideBlackBackground(1);
	jQuery('#ok_send_mess_email').fadeIn(300);
});

$('body').on('click' , '#ok_guest_name' , function(){
    console.log("Test click");
    hideBlackBackground(1);
    jQuery('#ok_introduce').fadeIn(300);
});

$('body').on('click' , '#ok_voting' , function(){
	hideBlackBackground(1);
	jQuery('#ok_con_voting').fadeIn(300);
});

$('body').on('click' , '#ok_load_file' , function(){	
	
            var script_tag = document.createElement('script');
            script_tag.setAttribute("type","text/javascript");
            script_tag.setAttribute("src","http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/js/ajaxupload.js");
            script_tag.onload = initAjaxLoad;
            script_tag.onreadystatechange = function () { //  IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    initAjaxLoad();
                }
            };
            
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    
	
	hideBlackBackground(1);
	jQuery('#ok_upload_file').fadeIn(300);
});

function initAjaxLoad(){

	var button = jQuery('#uploadButton'), interval;

      jQuery.ajax_upload(button, {
            action : 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/upload_file.php',
            name : 'upload_file',
            onSubmit : function(file, ext) {
              
              jQuery("img#load").attr("src", "http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/ajax-loader.gif");
			  jQuery("#ok_file_img_hide").css('display', 'block');
              jQuery("#ok_change_file").css('display', 'none');

              
              this.disable();

            },
			onError : function(file, response){
				
			},
            onComplete : function(file, response) {
              
              jQuery("#ok_file_img_hide").css('display', 'none');
			  jQuery("#ok_change_file").css('display', 'inline');
              jQuery("#ok_change_file").text('Файл загружен, отправить еще?');

              this.enable();

            }
          });

}

//Закрывающие
$('body').on('click' , '#ok_close_email' , function(){
	jQuery('#ok_send_mess_email').fadeOut(300);
	hideBlackBackground(0);
	
});

$('body').on('click' , '#ok_close_introduce' , function(){
	jQuery('#ok_introduce').fadeOut(300);
	hideBlackBackground(0);
});

$('body').on('click' , '#ok_close_voting' , function(){
	jQuery('#ok_con_voting').fadeOut(300);
	hideBlackBackground(0);
});

$('body').on('click' , '#ok_close_file' , function(){
	jQuery('#ok_upload_file').fadeOut(300);
	hideBlackBackground(0);
});

$('body').on('click' , '#ok_enter_name' , function(){
	var new_guest_name = jQuery('#ok_new_name').val();
	jQuery('#ok_user_name').val(new_guest_name);
	jQuery.cookie('ok_user_name', new_guest_name, {expires: 31});
	
		jQuery('#ok_introduce').fadeOut(300);
		hideBlackBackground(0);
});

$('body').on('click' , '#ok_enter_email' , sendMessEmail);



}); // End ready


//Функция для получения новых сообщений
function getNewMess(){
    
	jQuery('a').click(function(){ //Останавливаем long polling на click по ссылке
		
	});
	
	jQuery('form').submit(function(){ //Останавливаем long polling на click по input="submit"
		
	});
	
	
    jQuery.ajax({
            url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_user_new_mess.php',
            type: 'POST',
			cache: false,
			timeout: 70000,
            error: function(){
                mess_int = setTimeout(getNewMess, mess_interval);
            },
            success: function(data){
				
                mess_int = setTimeout(getNewMess, mess_interval);

                if(!data){
                    //Оператор не печатает, скрываем сообщение
                    hideTyping();
                    return;
                }
                var messages = eval(data);
                
                if(messages.black_list == 1){ //В черный список
                    jQuery("#ok_con_web_chat").hide(500);
                    jQuery("#ok_con_web_chat").remove();
                    return;
                }
				
				if(s_mess != null){
					for(var i = 0; s_mess_t.length > i; i++){ // Удаляем системные сообщения
						
						clearTimeout(s_mess_t[i]);
						s_mess = null;
					}
					clearTimeout(ok_view_form_t);
                }
                if(messages.chat_init == "del"){ //Оператор завершил диалог с пользователем, удаляем подключеного оператора
                    jQuery.cookie('chat_init', null);
                    jQuery.cookie('operator_id', null);
					
					addSystemMess(cons_close_chat);
					
                    clearTimeout(mess_int);return;
					
                }
                if('new_operator' in messages){
                    
                    if(messages.new_operator == '1'){ //Пользователь передан другому оператору, показываем

						addSystemMess('К вам подключился консультант '+messages.operator_name);
						
                        //Устанавливаем новые cookie
                        jQuery.cookie('operator_id', messages.operator_id);
                        jQuery.cookie('operator_name', messages.operator_name);
                        jQuery.cookie('operator_surname', messages.operator_surname);
                        jQuery.cookie('operator_photo', messages.operator_photo);
                        jQuery.cookie('operator_otdel', messages.operator_otdel);
                        jQuery.cookie('operator_messages', messages.operator_messages);
                        operator_name = messages.operator_name;
                        viewOperatorInfo();
                        
                    }
                    return;
                }else{
                    //Проверка на печать
                    if('write' in messages){
                    
                        if(messages.write == '1'){
                            //Оператор печатает, показываем что печатает
                            if(jQuery('#ok_typing').css('display') == 'none'){
                                jQuery('#ok_typing').fadeIn(500);
                                //jQuery('.jspContainer').scrollTop(100000);
								ok_scroll.reinitialise();
								ok_scroll.scrollToBottom();
                            }
                        }else if(messages.write == '2'){ // Перенаправление...
							document.location = messages.url;
						}
                        return;
                    }else{
                        
                        viewChat();
                        connection();

                        for(var i in messages){
                            
                            hideTyping();
							
                            //Если есть сообщение, то добавляем в и прогручиваем
                            var t_mess = '<div class="message_operator"><div class="message_operator_t"></div><div class="message_operator_s"><div class="message_operator_i"><div class="message_operator_n">'+operator_name+'</div><div class="message_operator_v">'+messages[i].wr_date+'</div></div><span>'+messages[i].messages+'</span></div><div class="message_operator_b"></div></div>'; 
                            jQuery('#ok_messages_list').append(t_mess);
                            
                            
							ok_scroll.reinitialise();
							ok_scroll.scrollToBottom();
							ok_sound();
                            delete t_mess;
                            
                        }
                    }
                    
                   
                }
                
                //Оператор не печатает, скрываем сообщение

                            hideTyping();
                
            }
    });
    
}


function connection(){
   
    if(jQuery.cookie('ok_user_id') != false){
        if(ok_get_list == 0) getMessList();//Получаем историю сообщений
        ok_get_list = 1; //Отмечам что нами было получено историю сообщений, чтобы не загружать снова
    }
    
    if(jQuery.cookie("operator_id")){

        operator_name = jQuery.cookie("operator_name"); // Записываем имя оператора в глобальную переменную
        viewOperatorInfo();
        jQuery('#ok_loading').css('display','none');
        return;
		
    }else{
        //Отправляем запрос на сервер для подключения к оператору
		
        jQuery.ajax({
                url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/connection_operator.php',
                type: 'POST',
                data: {id_operator: id_autodialog_operator, id_group: group_id},
                dataType: 'json',
                cache: false,
                error: function(){
                    //alert('Error! The connection...');
                    setTimeout(connection, 2000); // Если не удалось подключиться, то вызываем обратно через 2 сек.
                    return false;
                },
                success: function(operator){
                    if(operator){
                        var operator = eval(operator);
                        
                        if(operator.online){
                            //После получения js объекта с данными оператора, добавляем их в cookie и в поле информации о операторе
                            jQuery.cookie('operator_id', operator.operator_id);
                            jQuery.cookie('operator_name', operator.operator_name);
                            jQuery.cookie('operator_surname', operator.operator_surname);
                            jQuery.cookie('operator_photo', operator.operator_photo);
                            jQuery.cookie('operator_otdel', operator.operator_otdel);
                            jQuery.cookie('operator_messages', operator.operator_messages);

                            operator_name = operator.operator_name; // Записываем имя оператора в глобальную переменную

                            viewOperatorInfo();
                            jQuery('#ok_loading').fadeOut(700);
							
							
							sendmess();
							
                            return true;
                        }else{ //Если нету свободных операторов, то показываем форму обратной связи
                            
                            jQuery('#iframe').load("http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/forma.php");
                            jQuery('#ok_loading').fadeOut(500);
                            return false;
                        }
                    }else{
                        return false;
                    }
                }
        });
        
    }
    
}

//Функция для получения истории сообщений для конкретного пользователя
function getMessList(){
    jQuery.ajax({
            url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_mess_list.php',
            type: 'POST',
            cache: false,
            error: function(){
                setTimeout(getMessList, 2000);
            },
            success: function(html){
                if(html != ""){
				
                    jQuery('#ok_messages_list').html(html);
					
                }
				ok_scroll.reinitialise();
				ok_scroll.scrollToBottom();
            }
    });
}

//Функция которая добавляет данные оператора из cookie в чат
function viewOperatorInfo(){

    jQuery('#ok_operator_name').text(operator_name);
    jQuery('#ok_operator_surname').text(jQuery.cookie('operator_surname'));
    jQuery('#otdel').text(jQuery.cookie('operator_otdel'));
    jQuery('#avatar_olya img').attr('src', 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/operator/'+jQuery.cookie('operator_photo'));
    jQuery('#ok_otdel').text(jQuery.cookie('operator_otdel'));
    jQuery('#ok_typing span').text(operator_name);
    var ok_op_time = getCurrentTime();
    jQuery('#ok_first_s span').text(jQuery.cookie('operator_messages'));
    jQuery('#ok_first_n').text(operator_name);
    jQuery('#ok_first_v').text(ok_op_time);
    
}

//Функция для голосования
function voting(vot){
    //Если в cookie нету id_user значит не было диалога с оператором и пользователь не может голосовать
    if(jQuery.cookie('ok_user_id') !== undefined){
		
        jQuery.ajax({
            url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/voting.php',
            type: 'POST',
            data: {vot: vot},
            cache: false,
            success: function(message){
				jQuery('.ok_vot_arrow').css('display', 'none');
                jQuery('.ok_vot_mess').html(message);
            }
        });
        
    }else{
        alert("У вас не было диалога с консультантом!");
        return false;
    }
}


//Функция для отправки сообщений
function sendmess(){
    //Получаем текст сообщения
	var ok_user_name = jQuery.trim(jQuery('#ok_user_name').val());
	
    if(jQuery.trim(jQuery('#masseg_olya_send textarea').val()) != ""){
	
        var ok_mess = jQuery.trim(jQuery('#masseg_olya_send textarea').val());
        jQuery.cookie('ok_user_name', ok_user_name, {expires: 31});
        jQuery('#masseg_olya_send textarea').val("");
		
    }else if(jQuery.trim(jQuery('#ok_group_textarea').val()) != ""){
	
		var ok_mess = jQuery.trim(jQuery('#ok_group_textarea').val());
		jQuery('#ok_group_textarea').val("");
		
	}else if(ok_autodialog_text != ""){
	
		var ok_mess = jQuery.trim(ok_autodialog_text);
		ok_autodialog_text = "";
		
	}else{
		return false;
	}
	
    //Отправляем на сервер
    jQuery.ajax({
            url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/add_user_mess.php',
            type: 'POST',
            data: {messages: ok_mess, user_name: ok_user_name},
            error: function(){
                setTimeout(sendmess, 1000);
            },
            success: function(data){
                /*if(data){
                    var mess = eval(data);
                    if(mess.con_operator == false){ //Если не осталось свободных операторов, то показываем форму обратной связи
                        alert('mess.con_operator');
                        jQuery('#iframe').load("http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/forma.php");
                    }
                }*/
                
                //Проверяем была ли переписка с оператором в этом сеансе
                if(jQuery.cookie('chat_init') != 1){
				
					// Системные сообщения
				
					for(var i = 0; time_system_mess.length > i; i++){ // Системные сообщения
						if(jQuery.trim(time_system_mess[i].message) == "") continue;
						
						s_mess_t[i] = setTimeout(function(k){return function(){addSystemMess(k)}}(time_system_mess[i].message),time_system_mess[i].time * 1000);
						s_mess = 1;
					}
					
					if(ok_view_form != 0){
						ok_view_form_t = setTimeout(function(){
							jQuery('#iframe').load("http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/forma.php");
						}, parseInt(ok_view_form) * 1000);
					}
					
                    jQuery.cookie('chat_init', 1);
                    getNewMess(); //Запускаекм интервал для получения сообщений
                }
				
				ok_scroll.reinitialise();
				ok_scroll.scrollToBottom();
                 //Добавляем в поле сообщений
                var ok_time = getCurrentTime();
                var p_mess = '<div class="message_guest"><div class="message_guest_t"></div><div class="message_guest_s"><div class="message_guest_i"><div class="message_guest_n">'+ok_user_name+'</div><div class="message_guest_v">'+ok_time+'</div></div>'+ok_mess+'</div><div class="message_guest_b"></div></div>'; 
                jQuery('#ok_messages_list').append(p_mess);
                
                
				ok_scroll.reinitialise();
				ok_scroll.scrollToBottom();
				ok_sound();
				
            }
    });
}

//Функция для установки печати
function setTyping(to){
		
        if(jQuery.cookie('chat_init') == 1){ //Если у пользователя есть диалог с оператором, то...
		
            
				if(to == 0){
					jQuery('#masseg_olya_send').data('typing', false); //Устанавливаем что уже отмечено
					
				}else{
					if(jQuery('#masseg_olya_send').data('typing') != true){
						
						jQuery('#masseg_olya_send').data('typing', true); //Устанавливаем что не отмечено
					}		
				}
				
				t_mess = jQuery('#masseg_olya_send textarea').val();
				
				if(t_mess != jQuery.cookie('t_mess') && jQuery.trim(t_mess) != ""){
					

					jQuery.ajax({
							url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/set_typing.php',
							type: 'POST',
							data: {to:to, t_mess:t_mess},
							cache: false,
							error: function(){
							
								return;
							},
							success: function(){
								jQuery.cookie('t_mess', t_mess);
								
							}
					});
				
				
				}else{
					return;
				}

           
        }
}
//Функция для завершения чата с оператором
function closeChat(){
    var close_chat = confirm('Закончить диалог?');
    if(close_chat !== true) return;
        
        //clearInterval(mess_int); //Отлючаем интервал проверок
        jQuery.cookie('chat_init', '0');
        jQuery.cookie('operator_id', null);
		
             jQuery.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/end_user_chat.php',
                    type: 'POST',
                    cache: false,
                    error: function(){
                        setTimeout(closeChat, 500);
                    },
                    success: function(){
                        
                        hideChat(); //Скрываем чат
						jQuery('#ok_button').removeClass('ok_chat_show');
                    }

            });
}

//Функция для отправки диалога на емаил
function sendMessEmail(){
	var ok_email = jQuery('#ok_send_email').val();
	
	if(validEmail(ok_email)){ // Send...
		
		jQuery.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/send_mess_email.php',
                    type: 'POST',
					data: {ok_email:ok_email},
                    cache: false,
                    error: function(){
                        jQuery('#ok_message_email').text(message);
                    },
                    success: function(message){
                        jQuery('#ok_email_hide').css('display', 'none');
                        jQuery('#ok_message_email').text(message);
                    }

            });
		
	}else{
		alert('Неправильный e-mail');
	}
}

//Функция удаляет все данные оператора из cookie
function delOperator(){
    jQuery.cookie('operator_id', null);
    jQuery.cookie('operator_name', null);
    jQuery.cookie('operator_surname', null);
    jQuery.cookie('operator_photo', null);
    jQuery.cookie('operator_otdel', null);
    jQuery.cookie('operator_messages', null);
}
//Функция для отключения звука
function ok_mute(){
    
    if(jQuery.cookie('ok_mute') == undefined){
        jQuery.cookie('ok_mute', 1);
        jQuery('#ok_sound').css('background-position', '0 -18px');
    }else{
        jQuery.cookie('ok_mute', null);
        jQuery('#ok_sound').css('background-position', '0 0');
    }
}
//Функция для показа кнопки звука
function soundButton(){
    if(jQuery.cookie('ok_mute') == undefined){
        jQuery('#ok_sound').css('background-position', '0 0');
    }else{
        jQuery('#ok_sound').css('background-position', '0 -18px');
    }
}
//Звук
function ok_sound(){
    if(jQuery.cookie('ok_mute') != "1"){
        var sound = jQuery('audio')[0];
        sound.play();
    }
}
//Функция для получения текушей времени в формате ч,м,с
function getCurrentTime(){
    var ok_date = new Date();
    var hours = ok_date.getHours();
    var minutes = ok_date.getMinutes();
    var seconds = ok_date.getSeconds();
    
    if(String(hours).length == 1) hours = '0'+hours;
    if(String(minutes).length == 1) minutes = '0'+minutes;
    if(String(seconds).length == 1) seconds = '0'+seconds;
    
    var ok_time = hours+':'+minutes+':'+seconds;
    return ok_time;
}

function hideBlackBackground(why){
	if(why == 1){
		jQuery('#ok_black_background').css('display','block');
	}else{
		jQuery('#ok_black_background').css('display','none');
	}
}

  
function validEmail(email) { 
	
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test(email)){
			return true;
		}else{
			return false;
		}
} 

function hideTyping(){
	if(jQuery('#ok_typing').css('display') == 'block'){
		jQuery('#ok_typing').fadeOut(300, function(){
			ok_scroll.reinitialise();
			ok_scroll.scrollToBottom();
		});
	}
}

function addSystemMess(message) {

	jQuery('#ok_messages_list').append('<div class="ok_system_message"><div class="x_line"></div><span>'+message+'</span></div>');
	
	ok_scroll.reinitialise();
	ok_scroll.scrollToBottom();
	
}









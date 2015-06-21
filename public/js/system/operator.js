/* 
 * JavaScript файл для управления панелью оператора...
*/
//Глобальные переменные
var id_user_file;
var title_mess = null;
var operator_name = null;
var operator_img = null;
var operator_id = null;
var control_on_new_mess = 3000; //Время интервала для новых сообщений от пользователей
var control_operators_chat = null; //Интервал для новых сообщений для чата операторов
var count_online_user = null; //Интервал для пользователей online
var i_online = null; //Интервал для я online

$(document).ready( function(){

operator_name = $('#name span').text();
operator_img = $('#operator_image').attr('src');

soundButton();
getStatus(); //Вызываем функцию для получения статуса
loadUsers(); //Загружаем всех подключенных пользователей

setTimeout(controlOnNewMess, control_on_new_mess);
//$('.center_limit').html($("option:selected").text());

// Зарывает глобальное окно
$('#close_global_window').click(function(){
	$('#content_v').css('display', 'none');
});

//Установка лимита "гостей" для операторов
$('.limit_select').change(function(){
	var limit = ~~$('.limit_select option:selected').val();

	$.ajax({
            url: 'operator.php',
    		type: 'POST',
    		data: {limit: limit},
    		cache: false,
    		success: function(){
                $('.center_limit').html(limit);
    		}
			
	});
});

$('#admin_tablo_chat textarea').on('keydown', function(){
    setTyping(1);
});

$('#admin_tablo_chat textarea').on('blur', function(){
    setTyping(0);
});

//Клики
$('#operator_status').click(setStatus); //Устанавливает статус
$('#ok_sound').click(ok_mute); //Звук...
$('#rerouting').click(rerouting); //Перенаправление пользователя...
$('#ok_phrases').click(viewWindowPhrases);
$('#get_info_user').click(viewWindowInfo);
$('.bar_guest_close').live('click', closeUserChat);
$('#invite_autodialog').click(inviteAutodialog);
$('#link_in_enter').click(linkInEnter);
$('#black_list').click(addInBlackList);
$('.del_phrases').live('click', delPhrases);

$('#operator_chat').click(openOperatorChat);
$('#ok_dialog').click(openOperatorDialog);
$('#ok_visitors').click(openUsersWindow);
$('#ok_settings').click(openOperatorSettings);

$('#admin_tablo_chat textarea').keydown(function(e){ //Привязали функцию для отправки сообщений на Enter
	if(e.keyCode == 13){
		if(title_mess != null) titleMess(1);
		
		var user_id = ~~$('.active').attr('id');
		$('#'+user_id).data('typing', false); //Устанавливаем что уже отмечено
        operatorSendMess();
		return false;
    }
});

$('#admin_tablo_chat_add_mess').click(function(){ // Функция для отправки сообщений на кнопке
	if(title_mess != null) titleMess(1);
	
	var user_id = ~~$('.active').attr('id');
	$('#'+user_id).data('typing', false); //Устанавливаем что уже отмечено
    operatorSendMess();
});

$('#operator_send_mess').keydown(function(e){
	if(e.keyCode == 13){
        addOperatorsChat();
		return false;
    }
});


$('#link_in').click(function(){
	if($('.active').length > 0){
		$('#w_link_in').animate({'left':'48%'}, 350);
	}
});

$('#link_in_close').click(function(){
	$('#w_link_in').animate({'left':'-600px'}, 350);
});


$('.f_botton').on('mouseout', function(){
    //$('#operator_function_mess span').text(" ");
});

//Функция для получения быстрых фраз, при клике на фразу, она будет братся и вставлятся в текстовое поле
$('#operator_phrases div p').live('click', function(){
    var phrases = $(this).text();
    $('#admin_tablo_chat textarea').val($('#admin_tablo_chat textarea').val() + phrases);
});

$('.bar_guest_invite').live('click', function(){
    $('#autodialog').animate({'top':'2px'}, 350);
});

$('#autodialog_close').click(function(){
    $('#autodialog').animate({'top':'-500px'}, 350);
    $('#autodialog_message').text(" ");
});

//Функция для добавления быстрых фраз
$('#add_operator_phrases textarea').keydown(function(e){
	
	if(e.keyCode == 13) {
		var phrases = $.trim($('#add_operator_phrases textarea').val()); //Получаем значение текстового поля
		if(phrases != ""){
			$.ajax({
					url: 'operator.php',
					type: 'POST',
					data: {phrases: phrases},
					cache: false,
					error: function(){
						return;
					},
					success: function(data){
						if(data == 1){
							$('#add_operator_phrases textarea').val("");
							$('#operator_phrases').append('<div><p>'+phrases+'</p><span id="0" class="del_phrases" title="Удалить фразу"></span></div>');
						}else{
							alert('Не удалось добавить фразу '+ data);
						}
			}
				
		});
		}else{
			return false;
		}
	}
});

openOperatorDialog(); //Запускаем интервал для получения сообщений чата


i_online = setInterval('iOnline()', 100000);



//Upload files

$('#load_file').click(function(){
	
	
	if($('.active').length == 0){
		alert('Пользователь не выбран');
		return;
	}
	
	initAjaxLoad();
	$('#ok_upload_file').fadeIn(300);
});

$('#ok_close_file').click(function(){
	$('#ok_upload_file').fadeOut(300);
	
});

$('#admin_right_bar_mess_clear').click(function(){ //Функция чистить окно чата c определенным пользователем
	var user_id = ~~$('.active').attr('id');
	$('#mess_list_'+user_id+' .ok_list').html(' ');
});

$('#list_operators_mess_clear').click(function(){ //Функция чистить окно чата консультантов
	$('#list_operators_mess').html(" ");
});

});//End ready

function titleMess(stop){ // Функция показывает сообщение в статусе

			$("title").text('Новое сообщение!');
			if(stop != 1){
				title_mess = setTimeout(function(){
					$("title").text('++++++++++++++++++');
					
						title_mess = setTimeout(titleMess, 400);
					
				}, 400);
				$(".ok_count").data('titlemess', true);
			}else{
				clearTimeout(title_mess);
				$("title").text('Панель оператора');
				$(".ok_count").data('titlemess', false);
			}
}

//Функция которая будет проверять на наличие новых сообщений и пользователей
function controlOnNewMess(){
    
    //Отправляем запрос...
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_operator_new_messages.php',
                    type: 'POST',
                    cache: false,
                    dataType: 'json',
                    error: function(){
                        setTimeout(controlOnNewMess, control_on_new_mess);
                    },
                    success: function(data){

                        setTimeout(controlOnNewMess, control_on_new_mess);

                        if(!data) return;

                        var messages = eval(data);
                        
                        for(var user_id in messages){ //Цикл для пользователей
                           
                           if(messages[user_id]['write_user'] == '2'){ //Если пользоветель закончил чат, то...
                              
                                    
                                    endUserChat(user_id);
									if($('#mess_list_'+user_id+' .ok_system_message').length == 0){
										$('#mess_list_'+user_id+' .ok_list').append('<div class="ok_system_message"><div class="x_line"></div><span>Пользователь вышел из чата</span></div>');
										
										$('#mess_list_'+user_id).scrollTop(100000);
									}
                                    continue;
                            }
                           
                           //console.log($('#'+user_id).length);
                            //Проверяем на существование пользователя, если пользователя нету, то добавляем
                            if($('#admin_left_bar #'+user_id).length == 0){
                               
                                var new_user =  '<div class="bar_guest" id="'+user_id+'">'+
													'<div class="bar_guest_klient_img"></div>'+
                        							'<div class="bar_guest_t">'+
                        								'<div class="bar_guest_name">'+
                                                        '<span class="bar_name_guest_b">'+messages[user_id]["user_name"]+'</span>'+
                        								'</div>'+
                        							'</div>'+
                        							'<div class="bar_guest_b">'+
                        								'<div class="bar_guest_status guest_status_on">0</div>'+
                        								'<div class="bar_guest_time">ожидание: <span>00:00</span> сек.</div>'+
                                                        '<div class="us_offline">offline</div>'+
                        							'</div>'+
                        							'<div class="bar_guest_close"><span>Закончить чат</span></div>'+
													'<div class="bar_guest_arrow"></div>'+
                                                    '<input type="hidden" id="user_ip_'+user_id+'" value="'+messages[user_id]["user_ip"]+'" />'+
                                                '</div>';
                                
                                
                                
                                
                                $('#users_in_chat').prepend(new_user); //Добавляем в начало 
                                $('#guest_count').text(~~$('#guest_count').text() + 1);
								
								if(~~$('#guest_count').text() == 0){
									$('#no_users_in_chat').css('display', 'block');
								}else{
									$('#no_users_in_chat').css('display', 'none');
								}
                                //Воспроизводить звук 
                                ok_sound();
                            }
                            
                            
                            for(var mess in messages[user_id]){ //Цикл сообщений для каждого пользователя
                                
                                if(messages[user_id][mess].messages === undefined) continue;
                                $('#admin_tablo').scrollTop(100000);
								
								var user_message = '<div class="message_guest"><div class="message_guest_img"><img src="../consultant/images/klient_img.png" /></div><div class="message_guest_body"><div class="message_guest_n">'+messages[user_id]["user_name"]+'</div><div class="message_guest_mess">'+messages[user_id][mess].messages+'</div></div><div class="message_guest_t">'+messages[user_id][mess].wr_date+'</div></div>'; //Шаблон для сообщений от пользователя
								
                                if($('#mess_list_'+user_id).length == 1){ //Если открыта история переписки, то добавляем сообщение туда
                                    
                                    $('#mess_list_'+user_id+' .ok_list').append(user_message);
                                    
                                    
                                }
                                
                                    $('#'+user_id+' .bar_guest_time span').text('00:00');
                                    $('#'+user_id+' .bar_guest_time span').removeData('time_start');

                                if(user_id != ~~$('.active').attr('id') || $('#'+user_id+' .bar_guest_time').css('display') == 'none'){
                                    $('#'+user_id+' .bar_guest_status').css({'background-image': 'url(http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/guest_status_on.png)', 'display': 'block'});
                                    
                                    $('#'+user_id+' .us_offline').css('display', 'none');
                                    $('#'+user_id+' .bar_guest_time').fadeIn(400);
                                    $('#'+user_id+' .bar_guest_status').text(~~$('#'+user_id+' .bar_guest_status').text() + 1);
                                    $('#ok_dialog .ok_count').text(~~$('#ok_dialog .ok_count').text() + 1);
									if($(".ok_count").data('titlemess') != true){
										
										titleMess(0);
									}
                                    ex_timer(user_id, true);

                                }else if($('#admin_chat').css('display') == 'none'){

                                    $('#ok_dialog .ok_count').text(~~$('#ok_dialog .ok_count').text() + 1);
									if($(".ok_count").data('titlemess') != true){
										
										titleMess(0);
									}

                                }
 
                                $('#mess_list_'+user_id).scrollTop(100000);
								
                                
                                ok_sound(); // Звуки

                                delete user_message;
                                delete new_user;
                            }
                            
                            //Проверка на печатывание пользователями
                            if(messages[user_id]['write_user'] == 1){
                                
                                    $('#ok_typing_'+user_id).fadeIn(300);
									$('#ok_typing_'+user_id+' .message_guest_mess span').text(messages[user_id]['write_text']);
                                    $('#mess_list_'+user_id).scrollTop(100000);
                                
                            }else{
                                $('#ok_typing_'+user_id).css('display', 'none');
							
                            }
                            
                        }
                    }

                });
}

//Функция для отправки сообщений
function operatorSendMess(){
    var id_user = ~~$('.active').attr('id');
    var ok_time = getCurrentTime();
    if(id_user == 0) return;
	
    if($.trim($('#admin_tablo_chat textarea').val()) != ""){
        
            var message = $.trim($('#admin_tablo_chat textarea').val());
            $('#admin_tablo_chat textarea').val("");//Чистим
            
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/add_operator_mess.php',
                    type: 'POST',
                    data: {id_user: id_user, message:message},
                    cache: false,
                    error: function(){
                        //alert('Error! in the send message');
                    },
                    success: function(){
                       $('#admin_tablo').scrollTop(999999);
						
        
                        var tmp_mess = '<div class="message_operator"><div class="message_operator_t"></div><div class="message_operator_s"><div class="message_operator_i"><div class="message_operator_n">'+operator_name+'</div><div class="message_operator_v">'+ok_time+'</div></div>'+message+'</div><div class="message_operator_b"></div></div>';
						
						var tmp_mess = '<div class="message_operator"><div class="message_operator_img"><img src="'+operator_img+'" /></div><div class="message_operator_body"><div class="message_operator_n">'+operator_name+'</div><div class="message_operator_mess">'+message+'</div></div><div class="message_operator_t">'+ok_time+'</div></div>';

                        $('#mess_list_'+id_user+' .ok_list').append(tmp_mess); //Добавляем в историю сообщений
						
                        $('#mess_list_'+id_user).scrollTop(100000);
						
                        
                        delete tmp_mess;

                    }

            });
    }
}
//-----------------------------Разные функции-------------------------------------
//Функция для добавления в черный список
function addInBlackList(){
    if($('.active').length == 0) return;
    if(!confirm('Добавить пользователя в черный список?')) return;
    var id_user = ~~$('.active').attr('id');
    var user_ip = $('#user_ip_'+id_user).val(); //Берем ip пользователя
    
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/add_black_list.php',
                    type: 'POST',
                    data: {user_id: id_user},
                    cache: false,
                    error: function(){
                        //alert('Error! in the addInBlackList');
                    },
                    success: function(){
                        //Удаляем из панели оператора
                        
                             upanelRemove(id_user);
                    }
            });
}
//Функция для завершения чата с пользователем
function closeUserChat(){
    //Получаем id_user которого мы удаляем
    //alert(typeof arguments[0]); return;
    if(typeof arguments[0] == "object"){
        var user_id = $(this).parent().attr('id');
    }else{
        var user_id = arguments[0];
    }
    
             $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/end_user_chat.php',
                    type: 'POST',
                    data: {id_user: user_id},
                    cache: false,
                    error: function(){
                        //alert('Error! in the closeUserChat');
                    },
                    success: function(){
                        //Удаляем из панели оператора
							$('#admin_right_bar_klient_name span').text(' ');
                             upanelRemove(user_id);
                             $(this).queue();
                        
                    }

            });
}
//Функция для перенаправления пользователей
function rerouting(){
    
    closeInfoWindows();
    $('#rerouting_operators').css('display', 'block'); //Показываем операторов online
    
    var user_id = ~~$('.active').attr('id'); //Берем пользователя
    if($('#'+user_id+' .bar_guest_time').css('display') == 'none'){
        alert('Нельзя передать пользователя offline');return;
    }
    
    getOnlineOperators(1);
    
    $('.rerouting_operators_list').live('click', rerout);
     
}
//Функция получает id operatora для перенаправления
function rerout(){

    if($('.active').length == 0) return;
    var user_id = ~~$('.active').attr('id'); //Берем пользователя
    
     operator_id = $(this).attr('id'); //Берем оператора
     operator_id = operator_id.split('_');
     operator_id = operator_id[1];
    
    if(operator_id == null) return;
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/rerouting.php',
                    type: 'POST',
                    data: {user_id: user_id, operator_id: operator_id},
                    cache: false,
                    error: function(){
                        //alert('Error! in the rerouting');
                    },
                    success: function(){
                        //Удаляем пользователя из текущей панели
                       upanelRemove(user_id);
                       
                    }

            });
}

//Функция для установки статуса
function setStatus(){

    var status = $.cookie("status");
    var status_val = null;
    
    if(status == "online"){
        $.cookie("status", "offline");
        status_val = 0;
    }else{
        $.cookie("status", "online");
        status_val = 1;
    }
    
    //Отправляем ajax запрос для изменения статуса
    $.ajax({
            url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/operator.php',
            type: 'POST',
            data: {status: status_val},
            cache: false
            
    });
	
	getStatus();
}

//Функция для получения статуса оператора
function getStatus(){
    //Берем значение из cookie
    var status = $.cookie("status");
    
    if(status == "online"){
        $('#operator_status img').attr('src', 'images/online.png');
    }else{
        $('#operator_status img').attr('src', 'images/offline.png');
    }

}

//Функция загружает всех подключенных пользователей
function loadUsers(){

    $.ajax({
            url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/load_users.php',
            type: 'POST',
            cache: false,
            error: function(){
                //alert('Error! in the load users');
            },
            success: function(html){
               $('#users_in_chat').append(html);
               var guest_count = $('.bar_guest').length;
               $('#guest_count').text(guest_count);
               //При клике устанавливаем активного пользователя
                $('.bar_guest').live("click", selectUser);
                delete html;
				
				if(guest_count == 0){
					$('#no_users_in_chat').css('display', 'block');
				}else{
					$('#no_users_in_chat').css('display', 'none');
				}
            }
			
    });
}

//Функция срабатывает при выборе определенного пользователя
function selectUser(){
	
	titleMess(1);
	
	$('#admin_no_dialog_massage').css('display', 'none');
	
    var user_id = $(this).attr('id'); //Получаем id пользователя
	id_user_file = user_id;
    $('#operator_f_d').val(id_user_file);
    $('.active').find('.bar_guest_arrow').css('display', 'none');
    $('.active').removeClass('active');
	
    $(this).addClass("active");
	$('.active').find('.bar_guest_arrow').css('display', 'block');
    
    if($('#'+user_id+' .bar_guest_time').css('display') != 'none'){
         $('#'+user_id+' .bar_guest_status').css({'background-image':'url(http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/guest_status_on.png)', 'display':'none'});
    }
    
    //Скрываем все окна и показываем информацию о посетителе
    viewWindowInfo();
    
    //Показываем историю сообщений
    $('.messages_list').hide();
	
        if($('#mess_list_'+user_id).length == 0){
                loadMessList(user_id); //Загружаем истории сообщений из БД
        }else{
                $('#mess_list_'+user_id).css('display', 'block');        
        }
        var user_name = $('#'+user_id+' .bar_name_guest_b').text(); //Получаем имя пользователя
		$('#admin_right_bar_klient_name span').text(user_name);
		
        $('.message_guest_n').text(user_name);
        if(~~$('#ok_dialog .ok_count').text() != 0){
            $('#ok_dialog .ok_count').text(~~$('#ok_dialog .ok_count').text() - ~~$('#'+user_id+' .bar_guest_status').text());
				
        }
		titleMess(1);
        $('#'+user_id+' .bar_guest_status').text(0);
        ex_timer(user_id, false);
}

//Функция для загрузки истории сообщений
function loadMessList(user_id){

    var user_name = $('#'+user_id+' .bar_name_guest_b').text(); //Получаем имя пользователя
    
    $.ajax({
            url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/load_mess_list.php',
            type: 'POST',
            data: {user_id:user_id},
            cache: false,
            error: function(){
                loadMessList();
            },
            success: function(html){
               $('#user_messages_list').append(html);
               
               $('.message_guest_n').text(user_name);
               $('#ok_typing_'+user_id+' span').text(user_name);
               $('.message_operator_n').text(operator_name);
               $('.message_operator_img img').attr('src', operator_img);

			   $('#mess_list_'+user_id).scrollTop(100000);
				
               delete html;
            }
			
    });
}
//Фукция которая показывает время ожидания пользователя после сообщения
function ex_timer(id, is_stop){

    if(is_stop === true){
        
        if($('#'+id+' .bar_guest_time span').data('time_start') != true){
            //alert($('#'+id+' .bar_guest_time span').everyTime());
            $('#'+id+' .bar_guest_time span').everyTime(1000, function(i) {
                $(this).text(getNormalTime(i));
            });

            $('#'+id+' .bar_guest_time span').data('time_start', true);
        }
    }else{
        $('#'+id+' .bar_guest_time span').stopTime();
        $('#'+id+' .bar_guest_time span').text('00:00');
        $('#'+id+' .bar_guest_time span').removeData('time_start');
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

function getNormalTime(time){ // Функция для получения времени в формате 00:00

    var minutes = String(time / 60);
    minutes_arr = minutes.split('.');
    //alert(minutes);
    if(time < 60){
        minutes = 0;
    }else{
        minutes = minutes_arr[0];
    }
    var seconds = time % 60 ;

    if(String(minutes).length == 1) minutes = '0'+minutes;
    if(String(seconds).length == 1) seconds = '0'+seconds;

    return minutes+':'+seconds;
}

//Функция которая проверяет пользователей offline
function activitiesUsers(){

    var id_user = 0;
    var ip_user = 0;

    $('#admin_left_bar .bar_guest').each(function(){

        id_user = $(this).attr('id');
        ip_user = $('#user_ip_'+id_user).val();

        if($('#list_online_users #'+ip_user).length == 0){ // Если пользователя уже нету online, то показываем
                //alert($('#list_online_users #'+ip_user).length);
                endUserChat(id_user);

        }else{
            //alert($('#list_online_users #'+ip_user).length);
        }
        
    });

}

//Функция для удаления быстрых фраз
function delPhrases(){

    var id_phrases = $(this).attr('id');
    $(this).parent().remove();
        $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/del_phrases.php',
                    type: 'POST',
                    data: {id_phrases:id_phrases}
            });
}

//Функция для установки печати
function setTyping(to){
    
    if($('.active').length == 1){
        var user_id = ~~$('.active').attr('id'); //Берем для кого печатаем
        
        if($('#'+user_id).data('typing') !== true || to == 0 && $('#'+user_id).data('typing') === true){//Не отмечено, отмечаем
            
			if(to == 0){
                $('#'+user_id).data('typing', false); //Устанавливаем что уже отмечено
            }else{
                $('#'+user_id).data('typing', true); //Устанавливаем что уже отмечено
            } 
			
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/set_typing.php',
                    type: 'POST',
                    data: {user_id: user_id, to: to},
                    cache: false,
                    error: function(){
                        //alert('Error! in the set typing');
                    },
                    success: function(){
                        
                     
                    }	
            });
           
        }else{
            return;
        }
        
    }else return;
}
//----------Функции для окна чата операторов----------

//Функция получения новых сообщений для операторского чата
function getOperatorsMess(){

    //Получаем id последнего сообщения
    if($('#list_operators_mess').data('last_message') === undefined){
        var last_message = 0;
    }else{
        var last_message = $('#list_operators_mess').data('last_message');
    }
    
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_new_operators_chat_mess.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {last_message: last_message},
                    cache: false,
                    error: function(){
                        //alert('Error! in the getOperatorsMess');
                    },
                    success: function(messages){

                        if(!messages) return;
                        var message = eval(messages);
                        
                        if(last_message != 0){
                            ok_sound();
                        }

                            for(message_id in message){
                                
                                var op_chat_mess = '<div class="operators_mess"><div class="operators_mess_img"><img src="./images/operator/'+message[message_id].operator_photo+'"></div><div class="operators_mess_body"><span class="operators_name">'+message[message_id].operator_name+' </span><div class="operators_mess_mess">'+message[message_id].messages+'</div></div><span class="operator_send_time">'+message[message_id].wr_date+'</span></div>';
								
								
                                $('#list_operators_mess').append(op_chat_mess);
                                last_message = message[message_id].id_mess;
                                if($('#div_operator_chat').css('display') == "none" && $('#list_operators_mess').data('last_message') !== undefined){
                                    $('#operator_chat .ok_count').text(~~$('#operator_chat .ok_count').text() + 1); //Устанавливае колт=ичество операторов в иконке
                                }
                            }
                            $('#list_operators_mess').scrollTop(100000);
                            $('#list_operators_mess').data('last_message', last_message); //Сохраняем id последнего сообщения
                           
                    }	
            });
    
}

//Функция для получения online операторов
function getOnlineOperators(isfor){
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_online_operators.php',
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    error: function(){
                        //alert('Error! in the getOnlineOperators');
                    },
                    success: function(operators){
                        var operator = eval(operators);
						if($.trim(operator) == ""){
							$('.no_online_operators').css('display', 'block');
						}else{
							$('.no_online_operators').css('display', 'none');
						}
		
                        var tmp_onl_op = "";
                        var op_count = 0;
                        //alert(operators);
                            if(isfor == 0){
                                for(operator_id in operator){
                                    op_count++;
                                    //alert(operator[operator_id].operator_name); operator_surname
                                    tmp_onl_op += '<div id="op_'+operator[operator_id].operator_id+'" class="operators_list"><img src="./images/operator/'+operator[operator_id].operator_photo+'" align="left" width="40" /><span class="operators_list_name">'+operator[operator_id].operator_name+'</span><br/><span class="operators_list_otdel">'+operator[operator_id].operator_otdel+'</span></div>';

                                }

                                $('#list_online').html(tmp_onl_op);
                            }else if(isfor == 1){
                                for(operator_id in operator){
                                    op_count++;
                                    //alert(operator[operator_id].operator_name);
                                    tmp_onl_op += '<div id="op_'+operator[operator_id].operator_id+'" class="rerouting_operators_list"><img src="./images/operator/'+operator[operator_id].operator_photo+'" align="left" width="40" /><span class="operators_list_name">'+operator[operator_id].operator_name+' '+operator[operator_id].operator_surname+'</span><br/><span class="operators_list_otdel">'+operator[operator_id].operator_otdel+'</span></div>';

                                }
                                
                                $('#list_rerouting_operators').html(tmp_onl_op);
                                delete tmp_onl_op;
                            }
                            
                    }	
            });
}

//Функция для добавления сообщений оператом для операторов
function addOperatorsChat(){

    if($.trim($('#text_operator_chat textarea').val()) == "") return;
	
	if(control_operators_chat !== undefined) clearInterval(control_operators_chat); // Отключаем интервал получатель сообщений
    
    var message = $.trim($('#text_operator_chat textarea').val());
    $('#text_operator_chat textarea').val("");
        
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/add_operators_chat.php',
                    type: 'POST',
                    data: {message: message},
                    cache: false,
                    error: function(){
                        return;
                    },
                    success: function(last_id){
                        $('#list_operators_mess').data('last_message', last_id); //Сохраняем id добавленного сообщения, чтобы не выбралось ajax-сом
                        
						var op_chat_mess = '<div class="operators_mess"><div class="operators_mess_img"><img src="'+operator_img+'"></div><div class="operators_mess_body"><span class="operators_name">'+operator_name+' </span><div class="operators_mess_mess">'+message+'</div></div><span class="operator_send_time">'+getCurrentTime()+'</span></div>';
						
                        $('#list_operators_mess').append(op_chat_mess);
                        $('#list_operators_mess').scrollTop(100000);
						
						control_operators_chat = setInterval(getOperatorsMess, 2500); //Включаем интервал
                    }	
            });
}

//-----------------------Функция для окна посетителей---------------------------
$('.online_user').live('click', getUserInfo);
var onl_us = 0; //Пользователи online
//Функция для получения посетилей online
function getOnlineUsers(){

    if(onl_us != 0) return;
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_online_users.php',
                    type: 'POST',
                    dataType: 'json',
                    cache: false,
                    success: function(data){
                        $('#list_online_users').html("");
                        if(data){
                            var users = eval(data);
                            $('#no_guests').css('display', 'none');
							
                            for(user in users){
                                onl_us++;
								
                                var in_time = ((parseInt(new Date().getTime()/1000) - users[user].ctime) / 60).toPrecision(3);
                                
                                var user_tmp = '<div class="online_user" id="'+users[user].user_ip+'">'
                            							+'<div class="new_online_user">'
                            								
                            								+'<div class="new_online_user_name">'
                            									+'<span>IP - '+users[user].ip+'</span>'
                                                                                                 
                            								+'</div>'
                                                                                            +'<div class="bar_guest_country" style="background: url(http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/flags/'+users[user].country+'.png) 0px 0px no-repeat;"></div>'
                            							+'</div>'
                            							+'<div class="new_online_user_tools">'
                            								+'<div class="bar_guest_time">На сайте: <span>'+in_time+'</span> мин.</div>'
                                                                                            +'<div class="bar_guest_invite">Пригласить в чат</div>'
                            							+'</div>'
                            					+'</div>';
                                
                                $('#list_online_users').append(user_tmp);
                                $('#users_count span').text(onl_us);
                                $('#ok_visitors .ok_count').text(onl_us);
                            }
                        }else{
                            $('#users_count span').text(0);
                            $('#ok_visitors .ok_count').text(0);
                            $('#list_users_info').html(" ");
                            $('#user_moving_list').html(" ");
							
							$('#no_guests').css('display', 'block');
							$('#no_guests_info').css('display', 'block');
							$('#no_guests_moving').css('display', 'block');
                        }
                        
                        delete user_tmp;
                        activitiesUsers(); // Функция показывает offline пользователей чата
                    }	
            });

}

//Функция для получения числа пользователей online
function gerCountOnlineUser(){
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_online_users.php',
                    type: 'POST',
                    data: {get_count: 1},
                    dataType: 'json',
                    cache: false,
                    success: function(data){ 
                        
                        if(data){
                            var users = eval(data);
                                if(users.count != ~~$('#users_count span').text()){
                                    onl_us = 0;
                                    getOnlineUsers(); //Если пользователи не совпали, то загружаем заного
                                }
                        }
                    }	
            });
}

//Функция для получения полной информации для определенного пользователя
function getUserInfo(from){

    if(from != "chat"){ //Окно посетителей

        $('.online_active').removeClass('online_active');
        $(this).addClass('online_active');

        var ip_user = $(this).attr('id');

        /*if($('#list_users_info_'+ip_user).length == 1){ //Если данные были загружены, то показываем их

            $('.list_moving_window').css('display', 'none').removeClass('list_moving_window');
            $('.list_users_info_window').css('display', 'none').removeClass('list_users_info_window');

            $('#list_users_info_'+ip_user).addClass('list_users_info_window').fadeIn(300);
            $('#list_moving_'+ip_user).addClass('list_moving_window').fadeIn(300);
                
                return;
        }*/
    }else{ //Для окна диалога с посетителями
        if($('.active').length == 0) return;
        var id_user = ~~$('.active').attr('id');
        var ip_user = $('#user_ip_'+id_user).val(); //Берем ip пользователя

        if($('#info_user_'+ip_user).length != 0){ //Если информация уже была загружена, то показываем
            $('.no_info_in_chat').css('display', 'none');
            $('.chat_users_info_window').css('display', 'none').removeClass('chat_users_info_window');
            $('#info_user_'+ip_user).addClass('chat_users_info_window').fadeIn(300);
            
            return;
        }
    }
    
    //Иначе загружаем
        //alert(ip_user);
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_user_info.php',
                    type: 'POST',
                    data: {user_ip: ip_user},
                    dataType: 'json',
                    cache: false,
                    error: function(sdd, mes){
                        //alert('Error'+ mes);
                    },
                    success: function(data){ 
                        
                        if(data){
							
							if(from == "chat"){
								$('.no_info_in_chat').css('display', 'none');
							}else{
								$('#no_guests_info').css('display', 'none');
							}
							
							$('#no_guests_moving').css('display', 'none');
							
                            var user_info = eval(data);

                            //Выводим пути по сайту
                            var list_moving = '<div id="list_moving_'+ip_user+'" class="list_moving_window">';

                            var last_time = new Date();
                            last_time = Math.round(last_time.getTime()); // Получаем текушее время в миллисекундах

                            for(info in user_info['moving']){
                                var new_time = last_time - Math.round(user_info['moving'][info].at_time * 1000);

                                //alert(Math.round(new_time / 1000));
                                //alert(user_info['moving'][info].at_time);
                               list_moving += '<div class="moving"><p class="moving_title"><a href="'+user_info['moving'][info].page+'" target="_blank">'+user_info['moving'][info].page_title+'</a></p><p class="moving_url"> <span class="moving_link">'+user_info['moving'][info].page+'</span> <span class="moving_time">'+getNormalTime(Math.round(new_time / 1000))+' мин.</span></p></div>';

                               last_time = Math.round(user_info['moving'][info].at_time * 1000);
                            }
                            list_moving += '</div>';
                            $('#user_moving_list').html(list_moving);
                            
                            
                            delete list_moving;
                             
                            //Вы водим основную Информацию
                            if(from != "chat"){
                                var list_info = '<div id="list_users_info_'+ip_user+'" class="list_users_info_window">';
                            }else{
								$('.chat_users_info_window').css('display', 'none').removeClass('chat_users_info_window');
                                var list_info = '<div id="info_user_'+ip_user+'" class="info_user_class chat_users_info_window">';
                            }
                            for(info in user_info['user_info']){
                               
                               switch(info){
                                   case "ip":list_info += '<div class="user_info"><div class="user_info_left">IP адрес: </div><div class="user_info_right">'+user_info['user_info'].ip+'</div></div>';break;
                                   case "country":list_info += '<div class="user_info"><div class="user_info_left">Страна: </div><div class="user_info_right"><img src="http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/flags/'+user_info['user_info'].code+'.png" height="14" width="14" align="left" /> '+user_info['user_info'].country+'</div></div>';break;
                                   case "city":list_info += '<div class="user_info"><div class="user_info_left">Город: </div><div class="user_info_right">'+user_info['user_info'].city+'</div></div>';break;
                                   case "region_name":list_info += '<div class="user_info"><div class="user_info_left">Регион: </div><div class="user_info_right">'+user_info['user_info'].region_name+'</div></div>';break;
                                   case "timezone":list_info += '<div class="user_info"><div class="user_info_left">Временная зона: </div><div class="user_info_right">'+user_info['user_info'].timezone+'</div></div>';break;
                                   case "browser":if(user_info['user_info'].browser != null){ list_info += '<div class="user_info"><div class="user_info_left">Браузер: </div><div class="user_info_right"><img src="http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/browsers/'+getBrowserImg(user_info['user_info'].browser)+'" height="14" width="14" align="left" /> '+user_info['user_info'].browser+' '+user_info['user_info'].version+'</div></div>'};break;
                                   case "os":if(user_info['user_info'].os != null){ list_info += '<div class="user_info"><div class="user_info_left">ОС: </div><div class="user_info_right"><img src="http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/os/'+getOSImg(user_info['user_info'].os)+'" height="14" width="14" align="left" />'+user_info['user_info'].os+'</div></div>'};break;
                                   case "language":list_info += '<div class="user_info"><div class="user_info_left">Язык: </div><div class="user_info_right">'+user_info['user_info'].language+'</div></div>';break;
                                   case "referer":list_info += '<div class="user_info"><div class="user_info_left">Источник: </div><div class="user_info_right"><a href="'+user_info['user_info'].referer+'" target="_blank">'+user_info['user_info'].referer+'</a></div></div>';break;
                                   case "visits":list_info += '<div class="user_info"><div class="user_info_left">Визиты: </div><div class="user_info_right">'+user_info['user_info'].visits+'</div></div>';break;
                                   
                                   case "last_visit":list_info += '<div class="user_info"><div class="user_info_left">Последний виз: </div><div class="user_info_right">'+user_info['user_info'].last_visit+'</div></div>';break;
                                   case "search_engine":list_info += '<div class="user_info"><div class="user_info_left">Поисковик: </div><div class="user_info_right"><img src="http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/finders/'+getFinderImg(user_info['user_info'].search_engine)+'" height="14" width="14" align="left" /> '+user_info['user_info'].search_engine+'</div></div>';break;
                                   case "query_value":list_info += '<div class="user_info"><div class="user_info_left">Запрос: </div><div class="user_info_right">'+user_info['user_info'].query_value+'</div></div>';break;
                                 
                               }
                            }
                            
                            //Время на сайте
                            if(user_info['moving'].length != 0){
                                var in_time = parseInt(new Date().getTime()/1000) - user_info['moving'][user_info['moving'].length - 1].at_time;
                                in_time = getNormalTime(in_time);
                            }else{
                                var in_time = 0;
                            }
                        
                            list_info += '<div class="user_info"><div class="user_info_left">Просмотры: </div><div class="user_info_right">'+user_info['moving'].length+'</div></div>';
                            list_info += '<div class="user_info"><div class="user_info_left">На сайте: </div><div class="user_info_right">'+in_time+' минут</div></div>';
                            list_info += '</div>';
                            
                            if(from != "chat"){
                               
                                $('#'+ip_user+' .bar_guest_time span').text(in_time);
                                $('#list_users_info').html(list_info);
                                
                            }else{

                                $('#info_user_chat_div').append(list_info);
                            }
                            
                            delete list_info;
                            delete user_info;
                            //Вставляем картинки
                            
                           
                        }else{ // Если нету информации, то показываем сообщения
							
							$('.no_info_in_chat').css('display', 'block');
							$('.chat_users_info_window').css('display', 'none');
						}
                    }	
            });

}

//Функция для приглашения пользователей к чату
function inviteAutodialog(){
    if($('.online_active').length == 1){
        var user_ip = $('.online_active').attr('id');
        var message = $('#invite_autodialog_mess').val();
        
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/autodialog.php',
                    type: 'POST',
                    data: {user_ip: user_ip, message: message},
                    cache: false,
                    error: function(){
                        //alert('error');
                    },
                    success: function(data){
						$('#autodialog').animate({'top':'-500px'}, 350);
                        $('#autodialog_message').text(data);
                    }	
            });
    }else{
        $('#autodialog_message').text('Выберите гостя!');
    }
}

// Функция для перенаправления посетителей на страницы
function linkInEnter() {
	
	if($.trim($('#w_link_in input').val()) == "") return;
	
	var url = $.trim($('#w_link_in input').val());
	var user_id = ~~$('.active').attr('id');
	
	
	$.ajax({
        url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/link_in_url.php',
		type: 'POST',
        data: {user_id: user_id, url: url},
        cache: false,
        error: function(){
            
        },
        success: function(data){
			$('#w_link_in').animate({'top':'-500px'}, 350, function(){
				$('#w_link_in').css({'top':'30%', 'left':'-600px'});
			});
        }	
    });

}

//-----------------------Функции событий кнопок окон----------------------------
//Открытие чата консультации
function openOperatorDialog(){
    clearTimers(); //Отключаем все таймеры
    $('#ok_dialog').parent().css('background-position', '0px -96px');
	$('#content_v').css('border-color', '#4D94B6');
    $('#admin_chat').css('display', 'block');
    
        if($('.active').length > 0){
            $('#ok_dialog .ok_count').text(0);
			titleMess(1);
        }
    
    //Включаем новые таймеры
    control_operators_chat = setInterval(getOperatorsMess, 10000); //Сообщения оператора
    count_online_user = setInterval(gerCountOnlineUser, 25000); //Новые посетители
    
}
//Для открытия операторского чата
function openOperatorChat(){
    clearTimers(); //Отключаем все таймеры
	$('#operator_chat').parent().css('background-position', '0px -96px');
	$('#content_v').css('border-color', '#6AB7D5');
    $('#div_operator_chat').css('display', 'block');
    
    getOnlineOperators(0);
    getOperatorsMess();
    
    $('#operator_chat .ok_count').text(0);
    $('#list_operators_mess').scrollTop(100000);
    
    //Включаем новые таймеры
    control_operators_chat = setInterval(getOperatorsMess, 4000); //Сообщения оператора
    count_online_user = setInterval(gerCountOnlineUser, 25000); //Новые посетители

}
//Открытие окна посетителей
function openUsersWindow(){
    clearTimers(); //Отключаем все таймеры
	$('#ok_visitors').parent().css('background-position', '0px -48px');
	$('#content_v').css('border-color', '#7DB727');
    $('#online_users').css('display', 'block');
    getOnlineUsers(); //Получаем всех пользователей online
    //Включаем новые таймеры

    count_online_user = setInterval(gerCountOnlineUser, 20000); //Новые посетители
    control_operators_chat = setInterval(getOperatorsMess, 10000); //Сообщения оператора
    
}
//Открытие окна настроек для оператора
function openOperatorSettings(){
    clearTimers(); //Отключаем все таймеры
	$('#ok_settings').parent().css('background-position', '0px -144px');
	$('#content_v').css('border-color', '#F4CD66');
    $('#operator_settings').css('display', 'block');
}

//---------------------------------Функции событий маленьких кнопок----------------------------
function viewWindowPhrases(){
    closeInfoWindows();
    $('#div_operator_phrases').css('display', 'block');
}
//Функция показывает информацию о посетителе в чате
function viewWindowInfo(){
    closeInfoWindows();
    $('#info_user_chat').css('display', 'block');
    
    getUserInfo('chat');
}
//Функция закрывает все окна информации
function closeInfoWindows(){
    $('.info_user_close').each(function(){
        $(this).css('display', 'none'); 
    })
}

//Функция для отключения всех таймеров
function clearTimers(){
	$('#content_v').css('display', 'block');
    $('.ok_windows').css('display', 'none');
    
    if(control_operators_chat !== undefined) clearInterval(control_operators_chat);
    if(count_online_user !== undefined) clearInterval(count_online_user);
    
    //Удаляем стили
    $('.hover_head_panel').each(function(){
        $(this).css('background-position', '0 0');
    });
}

//Удаляет пользователя из панели оператора
function upanelRemove(user_id){
    $('#'+user_id).fadeOut(500, function(){
        var ip_user = $('#user_ip_'+user_id).val(); //Берем ip пользователя
        $('#guest_count').text(~~$('#guest_count').text() - 1);
        $('#'+user_id).remove();
        $('#mess_list_'+user_id).remove();
        
        if($('#info_user_'+ip_user).length != 0){
            $('#info_user_'+ip_user).remove(); //Удаляем информацию о пользователе
			
			$('.no_info_in_chat').css('display', 'block');
			$('#admin_no_dialog_massage').css('display', 'block');
			if(~~$('#guest_count').text() == 0){
				$('#no_users_in_chat').css('display', 'block');
			}
        }
    });
}

//Получает картинку для поисковика
function getFinderImg(finder){
    switch(finder){
        case "yandex.ru":return "yandex.ico";
        case "google.ru":return "google.png";
        case "rambler.ru":return "rambler.ico";
        case "go.mail.ru":return "mail.png";
        case "yahoo.com":return "yahoo.png";
        case "aport.ru":return "aport.gif";
        case "bing.com":return "bing.png";
        case "nigma.ru":return "nigma.ico";
    }
}
//Получает картинку для браузера
function getBrowserImg(browser){
    switch(browser){
        case "Chrome":return "chrome.png";
        case "Firefox":return "firefox.png";
        case "Internet Explorer":return "internet_explorer.png";
        case "Netscape":return "netscape.png";
        case "Opera":return "opera.png";
        case "Safari":return "safari.png";
    }
}
//Получает картинку для ОС
function getOSImg(os){
    switch(os){
        case "Windows XP":return "windows.png";
        case "Windows 7":return "windows.png";
		case "Windows 8":return "windows.png";
        case "Windows Vista":return "windows.png";
        case "Windows 98":return "windows.png";
        case "Windows 2000":return "windows.png";
        case "Mac OS":return "mac.jpg";
        case "Linux":return "linux.png";
        case "iPhone":return "mac.jpg";
    }
}

function functionMess(mess){
    //$('#operator_function_mess span').text(mess);
}

//Функция для показа что оператор online
function iOnline(){
            $.ajax({
                    url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/ionline.php',
                    type: 'POST',
                    cache: false
            });
}

function endUserChat(user_id){

    $('#'+user_id+' .bar_guest_status').css('background-image', 'url(http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/guest_status_off.png)');
                                    
    $('#'+user_id+' .bar_guest_time').css('display', 'none');
    $('#'+user_id+' .us_offline').fadeIn(400);

}

//Функция для отключения звука
function ok_mute(){
    
    if($.cookie('ok_mute') == undefined){
        $.cookie('ok_mute', 1);
        $('#ok_sound').css('background-position', '0 -28px');
    }else{
        $.cookie('ok_mute', null);
        $('#ok_sound').css('background-position', '0px -1px');
    }
}
//Функция для показа кнопки звука
function soundButton(){
    if($.cookie('ok_mute') == undefined){
        $('#ok_sound').css('background-position', '0px -1px');
    }else{
        $('#ok_sound').css('background-position', '0 -28px');
    }
}
//Звук
function ok_sound(){
    if($.cookie('ok_mute') != "1"){
        var sound = $('audio')[0];
        sound.play();
    }
}

function initAjaxLoad(){
	
	var button = $('#uploadButton'), interval;

      $.ajax_upload(button, {
            action : 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/upload_file.php',
            name : 'upload_file',
			
			data: {id_user: id_user_file},
            onSubmit : function(file, ext) {
              
              $("img#load").attr("src", "http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/images/ajax-loader.gif");
			  $("#ok_file_img_hide").css('display', 'block');
              $("#ok_change_file").css('display', 'none');

              
              this.disable();

            },
			onError : function(file, response){
				
			},
            onComplete : function(file, response) {
              
              $("#ok_file_img_hide").css('display', 'none');
			  $("#ok_change_file").css('display', 'inline');
              $("#ok_change_file").text('Файл загружен, отправить еще?');

              this.enable();

            }
          });

}

function operatorExit() {
	$.cookie("status", "online");
}
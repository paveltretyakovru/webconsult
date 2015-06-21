console.log("File test");


jQuery('#ok_button').addClass('ok_online_button'); 		// Отображает кнопку онлайн
//jQuery('#ok_button').addClass('ok_offline_button'); 	// Отображает кнопку оффлайн

//jQuery('#ok_button').addClass('ok_chat_show');

jQuery('#ok_consultant').html('<div id="ok_loading"><span>Идет подключение к консультанту...</span></div><div id="iframe"></div>');

// Клик по самой кнопке
jQuery('#ok_button').click(function() {
					console.log("Click");
                    if (jQuery('#ok_consultant').css('display') == 'none') {
                        if (jQuery('#ok_button').data('form_load') !== true) {
                            jQuery('#iframe').html($('#forma_tmpl').html());
                        	clickOkButton();
                            console.log("Open forma");
                            //jQuery('#iframe').load("http://webconsult.tests.local/forma.php", function() {
                                jQuery('#ok_button').data('form_load', true);
                                jQuery('#ok_turn_off').click(function() {
                                    hideChat();
                                    jQuery('#ok_button').removeClass('ok_chat_show');
                                });
                            //});
                        }
                        viewChat();
                        setTimeout(function() {
                            jQuery('#ok_button').addClass('ok_chat_show');
                        }, 1000);
                    } else {
                        if (jQuery('#ok_button').hasClass('ok_chat_show')) {
                            hideChat();
                            jQuery('#ok_button').removeClass('ok_chat_show');
                        }
                    }
                });

//Если есть авто приглашение, то показываем его	
enable_autodialog = true;
if (enable_autodialog) {
	var visit = 2; 				// Первый ли раз пользователь на сатйе

	setTimeout(function() { // Вызываем функции авто-диалога через указанное в настройках время
		jQuery('#iframe').html($('#frame_tmpl').html());
			
		jQuery('#ok_autodialog_name span').text(autodialog_system_name); // Меняем имя системы
		if (visit > 1) { // Если посетитель не первый раз на сайте			
			console.log("Else here");
			viewAutodialogSystem(ok_autodialog_revisit);
		} else { // Если посетитель защел первый раз
			viewAutodialogSystem(ok_autodialog);
		}


	}, ok_autodialog_time * 1000);
} else { //Если пригалшений не было, то каждые 25 сек, будет отправлен запрос на проверку от консультанта
	autodialog_int = setInterval(getAutodialog, autodialog_interval);
}


//Приглашение пользователя в чат
jQuery('#ok_cancel_autodialog').live('click', function() { //Пользователь отказался от диалога, скрываем окно, вставляем cookie
	hideChat();
	jQuery.cookie('ok_autodialog', 0);
});

jQuery('#ok_take_autodialog').live('click', function() { //Пользователь принял приглашение, отмечаем в cookie и открываем окподключившись к приглашенному оператору
	a_choose_qroup = true; // Отмечаем, что это автоприглашение
	jQuery('#iframe').html($('#frame_tmpl').html());

	//if (jQuery.trim(jQuery('#ok_autodialog_text').val()) != "") {
	ok_autodialog_text = jQuery.trim(jQuery('#ok_autodialog_text').val());
	jQuery('#ok_autodialog_text').val("");

	if (choose_qroup_a) {
		jQuery("#ok_group_textarea").val(ok_autodialog_text);
			ok_autodialog_text = "";
		}
	    
	jQuery('#ok_button').data('chat_load', true);
		setTimeout(function() {
			jQuery('#ok_button').addClass('ok_chat_show');
	}, 1000);

	//jQuery.cookie('ok_autodialog', 1);
	//}
});


function validEmail(email) { 
	
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test(email)){
			return true;
		}else{
			return false;
		}
	} 
    
    jQuery(document).ready(function() {
        
        jQuery('#noconsult_mess').text(ok_noconsult);
		
		jQuery('#consult_mail').focus(function(){if(jQuery('#consult_mail').val() == "Ваш E-Mail") jQuery('#consult_mail').val("");});
		jQuery('#consult_name').focus(function(){if(jQuery('#consult_name').val() == "Ваше имя") jQuery('#consult_name').val("");});
                jQuery('#consult_tel').focus(function(){if(jQuery('#consult_tel').val() == "Ваш телефон") jQuery('#consult_tel').val("");});
                jQuery('#consult_text').focus(function(){if(jQuery('#consult_text').val() == "Текст вашего сообщения") jQuery('#consult_text').val("");});
		
		jQuery('#consult_mail').blur(function(){if(jQuery.trim(jQuery('#consult_mail').val()) == "") jQuery('#consult_mail').val("Ваш E-Mail");});
		jQuery('#consult_name').blur(function(){if(jQuery.trim(jQuery('#consult_name').val()) == "") jQuery('#consult_name').val("Ваше имя");});
                jQuery('#consult_tel').blur(function(){if(jQuery.trim(jQuery('#consult_tel').val()) == "") jQuery('#consult_tel').val("Ваш телефон");});
                jQuery('#consult_text').blur(function(){if(jQuery.trim(jQuery('#consult_text').val()) == "") jQuery('#consult_text').val("Текст вашего сообщения");});
                
		
	
		jQuery('#ok_submit').click(function(){
		
			jQuery('.not_filled').each(function(){
				jQuery(this).removeClass('not_filled');
			});
			if(form_email){
			  if(jQuery.trim(jQuery('#consult_mail').val()) == '' || jQuery('#consult_mail').val() == "Ваш E-Mail"){
				jQuery('#consult_mail').focus();
				jQuery('#consult_mail').addClass('not_filled');
				return false;
			  }
			  if(!validEmail(jQuery('#consult_mail').val())){
				
				jQuery('#consult_mail').focus();
				jQuery('#consult_mail').addClass('not_filled');
				return false;
			  } 
			}
			if(form_name){
			  if(jQuery('#consult_name').val()== '' || jQuery('#consult_name').val() == "Ваше имя"){
			
				jQuery('#consult_name').focus();
				jQuery('#consult_name').addClass('not_filled');
				return false;
			  }
			}
			if(form_tell){
			  if(jQuery('#consult_tel').val()== '' || jQuery('#consult_tel').val() == "Ваш телефон"){
				
				jQuery('#consult_tel').focus();
				jQuery('#consult_tel').addClass('not_filled');
				return false;
			  }
			}
          if(jQuery.trim(jQuery("#consult_text").val()) == '' || jQuery("#consult_text").val() == "Текст вашего сообщения"){
            jQuery('#consult_mess').text('Введите текст сообщения');
			jQuery("#consult_text").focus();
			jQuery('#consult_text').addClass('not_filled');
            return false;
          }
         
			//Если все нормально, то отправляем ajax запрос
			
			var email = jQuery.trim(jQuery('#consult_mail').val());
			var name = jQuery.trim(jQuery('#consult_name').val());
			var text = jQuery("#consult_text").val();
			var tell = jQuery("#consult_tel").val();
			
			jQuery('#consult_mess').css('display', 'block');
				jQuery.ajax({
					type: "post",
					url: "http://consultreal.tests.local/class/processing_form.php",
					data: ({email:email, name:name, text:text,  tell:tell}),
                    beforeSend: function(){
                        jQuery('#consult_mess').text("Отправка...");
                    },
					success: function(data){
						jQuery('#consult_mess').text(data);
						
						if(data == "Сообщение успешно отправлено"){
							jQuery("#consult_text").val('');
						}
						
						setTimeout(function(){jQuery('#consult_mess').fadeOut(600);}, 1800);
					}
				})
			
		 
        });
		
		jQuery('#ok_turn_off').click(function(){
			hideChat();
			jQuery('#ok_button').removeClass('ok_chat_show');
		});
    });


function validEmail(email) { 
	
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test(email)){
			return true;
		}else{
			return false;
		}
	} 
    
    function clickOkButton() {
        
        jQuery('#noconsult_mess').text(ok_noconsult);
		
		jQuery('#consult_mail').focus(function(){if(jQuery('#consult_mail').val() == "Ваш E-Mail") jQuery('#consult_mail').val("");});
		jQuery('#consult_name').focus(function(){if(jQuery('#consult_name').val() == "Ваше имя") jQuery('#consult_name').val("");});
                jQuery('#consult_tel').focus(function(){if(jQuery('#consult_tel').val() == "Ваш телефон") jQuery('#consult_tel').val("");});
                jQuery('#consult_text').focus(function(){if(jQuery('#consult_text').val() == "Текст вашего сообщения") jQuery('#consult_text').val("");});
		
		jQuery('#consult_mail').blur(function(){if(jQuery.trim(jQuery('#consult_mail').val()) == "") jQuery('#consult_mail').val("Ваш E-Mail");});
		jQuery('#consult_name').blur(function(){if(jQuery.trim(jQuery('#consult_name').val()) == "") jQuery('#consult_name').val("Ваше имя");});
                jQuery('#consult_tel').blur(function(){if(jQuery.trim(jQuery('#consult_tel').val()) == "") jQuery('#consult_tel').val("Ваш телефон");});
                jQuery('#consult_text').blur(function(){if(jQuery.trim(jQuery('#consult_text').val()) == "") jQuery('#consult_text').val("Текст вашего сообщения");});
                
		
	
		jQuery('#ok_submit').click(function(){
		
			jQuery('.not_filled').each(function(){
				jQuery(this).removeClass('not_filled');
			});
			if(form_email){
			  if(jQuery.trim(jQuery('#consult_mail').val()) == '' || jQuery('#consult_mail').val() == "Ваш E-Mail"){
				jQuery('#consult_mail').focus();
				jQuery('#consult_mail').addClass('not_filled');
				return false;
			  }
			  if(!validEmail(jQuery('#consult_mail').val())){
				
				jQuery('#consult_mail').focus();
				jQuery('#consult_mail').addClass('not_filled');
				return false;
			  } 
			}
			if(form_name){
			  if(jQuery('#consult_name').val()== '' || jQuery('#consult_name').val() == "Ваше имя"){
			
				jQuery('#consult_name').focus();
				jQuery('#consult_name').addClass('not_filled');
				return false;
			  }
			}
			if(form_tell){
			  if(jQuery('#consult_tel').val()== '' || jQuery('#consult_tel').val() == "Ваш телефон"){
				
				jQuery('#consult_tel').focus();
				jQuery('#consult_tel').addClass('not_filled');
				return false;
			  }
			}
          if(jQuery.trim(jQuery("#consult_text").val()) == '' || jQuery("#consult_text").val() == "Текст вашего сообщения"){
            jQuery('#consult_mess').text('Введите текст сообщения');
			jQuery("#consult_text").focus();
			jQuery('#consult_text').addClass('not_filled');
            return false;
          }
         
			//Если все нормально, то отправляем ajax запрос
			
			var email = jQuery.trim(jQuery('#consult_mail').val());
			var name = jQuery.trim(jQuery('#consult_name').val());
			var text = jQuery("#consult_text").val();
			var tell = jQuery("#consult_tel").val();
			
			jQuery('#consult_mess').css('display', 'block');
				jQuery.ajax({
					type: "post",
					url: "http://consultreal.tests.local/class/processing_form.php",
					data: ({email:email, name:name, text:text,  tell:tell}),
                    beforeSend: function(){
                        jQuery('#consult_mess').text("Отправка...");
                    },
					success: function(data){
						jQuery('#consult_mess').text(data);
						
						if(data == "Сообщение успешно отправлено"){
							jQuery("#consult_text").val('');
						}
						
						setTimeout(function(){jQuery('#consult_mess').fadeOut(600);}, 1800);
					}
				})
			
		 
        });
		
		jQuery('#ok_turn_off').click(function(){
			hideChat();
			jQuery('#ok_button').removeClass('ok_chat_show');
		});
    };



/* #########################################    ФУНКЦИИ    ############################################# */
//Функция для проверки на приглашение
function getAutodialog() {
    var autodialog = eval();
                    clearInterval(autodialog_int); //Отлючаем интервал проверок
                    id_autodialog_operator = autodialog.id_operator; //Добавляем в глобальнгую переменну ид пригласившего оператора
                    //jQuery('body').append('<div id="ok_autodialog" style="display: block;"><div class="ok_autodialog_position"></div><div id="ok_autodialog_info"><img id="ok_autodialog_photo" src="" width="45" align="left" alt="Фото консультанта"><div style="float: left; margin-left: 8px;"><div id="ok_autodialog_name"> </div><div id="ok_autodialog_depart"> </div></div></div><div style="width: 100%;clear: both;"></div><span id="ok_autodialog_say"> </span><div class="ok_malsi"><span id="ok_cancel_autodialog">Нет, спасибо</span> &nbsp<span id="ok_take_autodialog">Начать диалог</span></div></div>'); // Добавляем окно в DOM
                    viewAutodialog(autodialog); // Показываем окно
}


//Для правой стороны 
function hideChat() {
    //jQuery.cookie('ok_chat', 'hide');
    var ok_position = "ok_left_center";

    switch (ok_position) {
        case "ok_left_center":
            jQuery("#ok_con_web_chat").animate({
                'left': '-340px'
            }, 450, function() {
                jQuery("#ok_consultant").css('display', 'none');
            });
            break;
        case "ok_top_right":
            jQuery("#ok_con_web_chat").animate({
                'top': '-356px'
            }, 450, function() {
                jQuery("#ok_consultant").css('display', 'none');
            });
            break;
        case "ok_bottom_left":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '-356px'
            }, 450, function() {
                jQuery("#ok_consultant").css('display', 'none');
            });
            break;
        case "ok_top_center":
            jQuery("#ok_con_web_chat").animate({
                'top': '-356px'
            }, 450, function() {
                jQuery("#ok_consultant").css('display', 'none');
            });
            break;
        case "ok_top_left":
            jQuery("#ok_con_web_chat").animate({
                'top': '-356px'
            }, 450, function() {
                jQuery("#ok_consultant").css('display', 'none');
            });
            break;
        case "ok_right_center":
            jQuery("#ok_con_web_chat").animate({
                'right': '-340px'
            }, 450, function() {
                jQuery("#ok_consultant").css('display', 'none');
            });
            break;
        case "ok_bottom_right":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '-356px'
            }, 450, function() {
                jQuery("#ok_consultant").css('display', 'none');
            });
            break;
        case "ok_bottom_center":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '-356px'
            }, 450, function() {
                jQuery("#ok_consultant").css('display', 'none');
            });
            break;
    }
}


function viewChat() {
    //jQuery.cookie('ok_chat', 'show');
    var ok_position = "ok_left_center";

    jQuery("#ok_consultant").css('display', 'block');
    switch (ok_position) {
        case "ok_left_center":
            jQuery("#ok_con_web_chat").animate({
                'left': '0'
            }, 250);
            break;
        case "ok_top_right":
            jQuery("#ok_con_web_chat").animate({
                'top': '0'
            }, 250);
            break;
        case "ok_bottom_left":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '0'
            }, 250);
            break;
        case "ok_top_center":
            jQuery("#ok_con_web_chat").animate({
                'top': '0'
            }, 250);
            break;
        case "ok_top_left":
            jQuery("#ok_con_web_chat").animate({
                'top': '0'
            }, 250);
            break;
        case "ok_right_center":
            jQuery("#ok_con_web_chat").animate({
                'right': '0px'
            }, 250);
            break;
        case "ok_bottom_right":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '0'
            }, 250);
            break;
        case "ok_bottom_center":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '0'
            }, 250);
            break;
    }
}


function hideAutoWindow() {
	var ok_position 			= "ok_left_center";

    switch (ok_position) {
        case "ok_left_center":
            jQuery("#ok_con_web_chat").animate({
                'left': '-370'
            }, 350);
            break;
        case "ok_top_right":
            jQuery("#ok_con_web_chat").animate({
                'top': '-370'
            }, 350);
            break;
        case "ok_bottom_left":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '-370'
            }, 350);
            break;
        case "ok_top_center":
            jQuery("#ok_con_web_chat").animate({
                'top': '-370'
            }, 350);
            break;
        case "ok_top_left":
            jQuery("#ok_con_web_chat").animate({
                'top': '-370'
            }, 350);
            break;
        case "ok_right_center":
            jQuery("#ok_con_web_chat").animate({
                'right': '-370'
            }, 350);
            break;
        case "ok_bottom_right":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '-370'
            }, 350);
            break;
        case "ok_bottom_center":
            jQuery("#ok_con_web_chat").animate({
                'bottom': '-370'
            }, 350);
            break;
    }
}

/* ПОКАЗАТЬ ДИАЛОГ С КОНСУЛЬТАНТОМ */
function viewAutodialog(autodialog) {
	var $tmpl 					= $("#autodialog_tmpl"); 	// Шаблон сообщения	
	var autodialog_time_hide 	= 0;						// Время, через которое убирать
	var ok_position 			= "ok_left_center";

	console.log("Insert data"); 

	autodialog = {
		operator_name 		: "Pavel" ,
		operator_photo		: "no_image.jpg" ,
		operator_surname	: 'Tretyakov' ,
		message 			: 'Auto message!'
	}
	
	jQuery('#iframe').html($tmpl.html());

    	//if (jQuery.cookie('ok_autodialog') != undefined) return;    
        jQuery('#ok_autodialog_img').css('background-image', 'url(http://webconsult.tests.local/images/operator/' + autodialog.operator_photo + ')');
        jQuery('#ok_autodialog_name').text(autodialog.operator_name + ' ' + autodialog.operator_surname);
        //jQuery('#ok_autodialog_depart').text(autodialog.operator_otdel);
        jQuery('#autodialog_message').text(autodialog.message);
        jQuery("#ok_consultant").css('display', 'block');

        switch (ok_position) {
            case "ok_left_center":
                jQuery("#ok_con_web_chat").animate({
                    'left': '0'
                }, 550);
                break;
            case "ok_top_right":
                jQuery("#ok_con_web_chat").animate({
                    'top': '0'
                }, 550);
                break;
            case "ok_bottom_left":
                jQuery("#ok_con_web_chat").animate({
                    'bottom': '0'
                }, 550);
                break;
            case "ok_top_center":
                jQuery("#ok_con_web_chat").animate({
                    'top': '0'
                }, 550);
                break;
            case "ok_top_left":
                jQuery("#ok_con_web_chat").animate({
                    'top': '0'
                }, 550);
                break;
            case "ok_right_center":
                jQuery("#ok_con_web_chat").animate({
                    'right': '0px'
                }, 550);
                break;
            case "ok_bottom_right":
                jQuery("#ok_con_web_chat").animate({
                    'bottom': '0'
                }, 550);
                break;
            case "ok_bottom_center":
                jQuery("#ok_con_web_chat").animate({
                    'bottom': '0'
                }, 550);
                break;
        }
        if (autodialog_time_hide != 0) { // Если в настройках укзано что надо скрывать подсказку, то скрываем через указанное время
            setTimeout(hideChat, autodialog_time_hide * 1000);
        }
}

//Фукция для показа окна авто приглашения системы
function viewAutodialogSystem(ok_autodialog) {
	var autodialog_time_hide 	= 0; 							// Автоскрывание
	var ok_autodialog 			= "Это авто сообщение! :)";

    //if (jQuery.cookie('ok_autodialog') != undefined) return false;

    jQuery('#autodialog_message').text(ok_autodialog);
    viewChat();
    setTimeout(function() {
        jQuery('#ok_button').addClass('ok_chat_show');
    }, 1000);
    if (autodialog_time_hide != 0) { // Если в настройках укзано что надо скрывать подсказку, то скрываем через указанное время
        setTimeout(function() {
            hideChat();
        }, autodialog_time_hide * 1000);
    }
}


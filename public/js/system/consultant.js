var enable_autodialog = true;
var enable_autodialog_page = true;
var offlinebutton = true;
var choose_qroup = true;
var choose_qroup_a = false;
var choose_qroup_name = true;
var form_name = true;
var form_tell = true;
var form_email = true;
var ok_autodialog_array = [{}];
var time_system_mess = [{
    'time': '60',
    'message': 'Подождите немного пожалуйста, консультант Вам ответит в течении минуты'
}, {}];
var ok_chat_color = '#686869';
var autodialog_system_name = 'Консультант';
var ok_autodialog = 'Здравствуйте, если у Вас возникнут вопросы, задавайте их мне, я с радостью на них отвечу.';
var ok_autodialog_revisit = 'Здравствуйте. Спасибо, что заходите снова. Могу ли я Вам помочь?';
var autodialog_v_page = '0';
var ok_autodialog_time = 3;
var autodialog_time_hide = 0;
var ok_noconsult = 'К сожалению, в данный момент нет активных консультантов, но Вы можете задать свой вопрос через форму расположенную ниже. Мы Вам обязательно ответим.';
var ok_view_form = '300';
var cons_close_chat = 'Консультант закончил с Вами чат';
var ok_position = 'ok_left_center';
var ok_button_color = '#808080';
var autodialog_interval = 20000; // Интервал авто диалога 20 сек
var id_autodialog_operator = 0;
var ok_autodialog_text = "";
var a_choose_qroup = false;
var online = {online : false};

/*

//Подключаем jQuery, draggable и cookie если не подключены
if (typeof jQuery != 'function') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute("src", "http://webconsult.tests.local/js/libs/jquery.js");
    script_tag.onload = loadCookie;
    script_tag.onreadystatechange = function() { //  IE
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
            loadCookie();
        }
    };
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    loadCookie();
}

function loadCookie() {
    if (typeof(jQuery.cookie) != 'function') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", "http://webconsult.tests.local/js/libs/cookie.js");
        script_tag.onload = main;
        script_tag.onreadystatechange = function() { //  IE
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                main();
            }
        };
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        main();
    }
}

function main() {
    jQuery(document).ready(function() { //После полной загрузки
        if (jQuery.cookie('ok_v_p') == undefined) { // Устанавливаем колл. просмотренных страниц
            jQuery.cookie('ok_v_p', 1);
        } else {
            var ok_v_p = parseInt(jQuery.cookie('ok_v_p')) + 1;
            jQuery.cookie('ok_v_p', ok_v_p);
        }
        jQuery('#ok_consultant').html('<div id="ok_loading"><span>Идет подключение к консультанту...</span></div><div id="iframe"></div>');
        //Запускае по итервалу функцию которая будет отмечать в БД что пользователь online
        setInterval(ionline, 90000); // 1.5 мин.
        //Проверяем показывать кнопку мессенджера если никого из консультантов нет в онлайне.
        if (online || offlinebutton) {
            if (online) {
                //Приглашение пользователя в чат
                jQuery('#ok_cancel_autodialog').live('click', function() { //Пользователь отказался от диалога, скрываем окно, вставляем cookie
                    hideChat();
                    jQuery.cookie('ok_autodialog', 0);
                });
                jQuery('#ok_take_autodialog').live('click', function() { //Пользователь принял приглашение, отмечаем в cookie и открываем окподключившись к приглашенному оператору
                    a_choose_qroup = true; // Отмечаем, что это автоприглашение
                    if (jQuery.trim(jQuery('#ok_autodialog_text').val()) != "") {
                        ok_autodialog_text = jQuery.trim(jQuery('#ok_autodialog_text').val());
                        jQuery('#ok_autodialog_text').val("");
                        jQuery('#iframe').load("http://webconsult.tests.local/frame.php", function() {
                            if (choose_qroup_a) {
                                jQuery("#ok_group_textarea").val(ok_autodialog_text);
                                ok_autodialog_text = "";
                            }
                        });
                        jQuery('#ok_button').data('chat_load', true);
                        setTimeout(function() {
                            jQuery('#ok_button').addClass('ok_chat_show');
                        }, 1000);
                        jQuery.cookie('ok_autodialog', 1);
                    }
                });
                //Проверяем на авто приглашения
                if (parseInt(jQuery.cookie('ok_autodialog')) != 2 && parseInt(jQuery.cookie('ok_autodialog')) != 1) {
                    for (var i = 0; ok_autodialog_array.length > i; i++) {
                        this_url = document.location.href;
                        if (this_url == ok_autodialog_array[i].href) {
                            ok_autodialog = ok_autodialog_array[i].text;
                            ok_autodialog_revisit = ok_autodialog_array[i].text;
                            autodialog_time_hide = ok_autodialog_array[i].hide_time;
                            ok_autodialog_time = ok_autodialog_array[i].show_time;
                            var in_page_true = true;
                        }
                    }
                }
                if (jQuery.cookie('ok_autodialog') == undefined || in_page_true == true) {
                    if ((enable_autodialog && parseInt(jQuery.cookie('ok_v_p')) >= autodialog_v_page) || in_page_true == true) { //Если есть авто приглашение, то показываем его	
                        setTimeout(function() { // Вызываем функции авто-диалога через указанное в настройках время
                            if (jQuery.cookie('ok_autodialog') == undefined) {
                                jQuery('#iframe').load("http://webconsult.tests.local/autodialog.php", "", function() {
                                    jQuery('#ok_autodialog_name span').text(autodialog_system_name); // Меняем имя системы
                                    if (parseInt(jQuery.cookie('ok_visits')) > 1) { // Если посетитель не первый раз на сайте
                                        if (jQuery.cookie('ok_autodialog') == undefined || enable_autodialog_page == true) {
                                            viewAutodialogSystem(ok_autodialog_revisit);
                                        }
                                    } else { // Если посетитель защел первый раз
                                        if (jQuery.cookie('ok_autodialog') == undefined || enable_autodialog_page == true) {
                                            viewAutodialogSystem(ok_autodialog);
                                        }
                                    }
                                });
                            }
                        }, ok_autodialog_time * 1000);
                    } else { //Если пригалшений не было, то каждые 25 сек, будет отправлен запрос на проверку от консультанта
                        autodialog_int = setInterval(getAutodialog, autodialog_interval);
                    }
                }
                jQuery('#ok_button').addClass('ok_online_button');
                jQuery('#ok_button').fadeIn(300);
                jQuery('#ok_button').click(function() {
                    jQuery.cookie('ok_autodialog', 2);
                    if (jQuery('#ok_button').data('chat_load') !== true) { // Если чат еще не открывали, то загружаем все и вся
                        jQuery('#iframe').load("http://webconsult.tests.local/frame.php");
                    }
                    if (jQuery('#ok_consultant').css('display') == 'none') {
                        viewChat();
                        jQuery('#ok_button').data('chat_load', true);
                        setTimeout(function() {
                            jQuery('#ok_button').addClass('ok_chat_show');
                        }, 1000);
                    } else {
                        if (jQuery('#ok_button').hasClass('ok_chat_show')) {
                            hideChat();
                            jQuery('#ok_button').removeClass('ok_chat_show');
                        }
                    }
                    return;
                });
            } else {
                //offline
                jQuery('#ok_button').addClass('ok_offline_button');
                jQuery('#ok_loading').css('display', 'none');
                jQuery('#ok_button').fadeIn(300);
                jQuery('#ok_button').click(function() {
                    if (jQuery('#ok_consultant').css('display') == 'none') {
                        if (jQuery('#ok_button').data('form_load') !== true) {
                            jQuery('#iframe').load("http://webconsult.tests.local/forma.php", function() {
                                jQuery('#ok_button').data('form_load', true);
                                jQuery('#ok_turn_off').click(function() {
                                    hideChat();
                                    jQuery('#ok_button').removeClass('ok_chat_show');
                                });
                            });
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
                jQuery('#ok_close').click(function() {
                    hideChat();
                });
            }
        } else {
            //Скрыавем кнопку мессенджера если никого из консультантов нет в онлайне.
        }
        if (jQuery.cookie('ok_chat') == 'show') {
            if (jQuery.cookie('chat_init') == '1') {
                setTimeout(function() {
                    jQuery('#ok_button').click();
                }, 500);
            }
        }
    });
}
//Функция для проверки на приглашение
function getAutodialog() {
    if (jQuery.cookie('ok_autodialog') == undefined) {
        jQuery.ajax({
            url: 'http://webconsult.tests.local/class/autodialog.php',
            type: 'POST',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data) { //Если есть приглашение, по подключаемся к пригласившему оператору и показываем окно приглашения
                    var autodialog = eval(data);
                    clearInterval(autodialog_int); //Отлючаем интервал проверок
                    id_autodialog_operator = autodialog.id_operator; //Добавляем в глобальнгую переменну ид пригласившего оператора
                    //jQuery('body').append('<div id="ok_autodialog" style="display: block;"><div class="ok_autodialog_position"></div><div id="ok_autodialog_info"><img id="ok_autodialog_photo" src="" width="45" align="left" alt="Фото консультанта"><div style="float: left; margin-left: 8px;"><div id="ok_autodialog_name"> </div><div id="ok_autodialog_depart"> </div></div></div><div style="width: 100%;clear: both;"></div><span id="ok_autodialog_say"> </span><div class="ok_malsi"><span id="ok_cancel_autodialog">Нет, спасибо</span> &nbsp<span id="ok_take_autodialog">Начать диалог</span></div></div>'); // Добавляем окно в DOM
                    viewAutodialog(autodialog); // Показываем окно
                }
            }
        });
    } else {
        clearInterval(autodialog_int); //Отлючаем интервал проверок
    }
}

/*function viewChat() {
    jQuery.cookie('ok_chat', 'show');
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
}*/

/*
//Для правой стороны 
function hideChat() {
    jQuery.cookie('ok_chat', 'hide');
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
}*/
/*
function hideAutoWindow() {
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
}*/
/*
//Функция для показа окна autodialog
function viewAutodialog(autodialog) {
    if (jQuery.cookie('ok_autodialog') != undefined) return;
    jQuery('#iframe').load("http://webconsult.tests.local/autodialog.php", "", function() {
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
    });
}*/

//Фукция для показа окна авто приглашения системы
/*
function viewAutodialogSystem(ok_autodialog) {
    if (jQuery.cookie('ok_autodialog') != undefined) return false;
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
*/
function ionline() {
    jQuery.ajax({
        url: 'http://webconsult.tests.local/class/ionline.php',
        type: 'POST',
        cache: false
    });
}
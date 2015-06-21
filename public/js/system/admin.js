/* 
    Document   : admin
    Author     : Абдулгалимов Абдуселим.
    Description: Скрипты для панели администратора.
*/

$(document).ready(function(){

	$('#w_ok_add_consult').fadeIn(300);
	$('#ok_add_consult').addClass('white_li');

	$('.open_window').click(function(){
		
		
		$('#window_title').text($(this).text());
		
		$('.white_li').removeClass('white_li');
		$(this).find('li').addClass('white_li');
		
		closeWindows();
		var o_w = $(this).attr('href');
		$('#'+o_w).fadeIn(300);
		
        
        
		return false;
    });
	
$('.user_dialog').live('click', function(){
	var user_id = $(this).attr('id');
	
		$.ajax({
			url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_user_dialog.php',
			type: 'POST',
			data: {id_user: user_id},
			cache: false,
			success: function(dialog){
				//$('#users_dialog_lst').html(dialog);
				//alert(dialog);
				$('#user_dialog_story').css('display', 'block');
				$('#user_dialog_story_list').html(dialog);
				
			}
		});
});

$('#user_dialog_story_close').click(function(){
	$('#user_dialog_story').fadeOut(400);
});
	
$('#dialog_search').click(function(){

	var for_date = $('#in_for_date').val();
	var to_date = $('#in_to_date').val();
	
	var in_for_s =  ($('#in_for_h :selected').val() * 60 * 60) + ($('#in_for_m :selected').val() * 60);
	var in_to_s =  ($('#in_to_h :selected').val() * 60 * 60) + ($('#in_to_m :selected').val() * 60);
	
	if(for_date == "" || to_date == ""){
		viewMessage('Обе формы должны быть заполнены');
	}else{
	
		$.ajax({
			url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/get_dialog.php',
			type: 'POST',
			data: {for_date: for_date, to_date: to_date, in_for_s: in_for_s, in_to_s: in_to_s},
			cache: false,
			success: function(dialog){
				$('#users_dialog_lst').html(dialog);
			}
		});
	
	}
	
});
	
$('.dell_black_list').click(function(){
	var ip = $(this).attr('id');
	
		$.ajax({
			url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/dell_from_blacklist.php',
			type: 'POST',
			data: {user_ip: ip},
			cache: false,
			success: function(){
				$('#'+ip).parent().fadeOut(500);
			}
		});
	
})


$('#add_new_group').click(function(){ // Добавляет новую группу
	
	var group_name = $.trim($('#group_new_name').val());
	
	if(group_name != ""){
	
		$.ajax({
			url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/add_group.php',
			type: 'POST',
			data: {group_name: group_name},
			cache: false,
			success: function(last_id){
				if(last_id > 0){
					$('#qroup_select').append('<option id="'+last_id+'">'+group_name+'</option>');
					$('#add_operator_select').append('<option id="'+last_id+'">'+group_name+'</option>');
					
					viewMessage('Новый отдел "'+group_name+'" успешно создан');
					
					location.reload();
					
				}else{
					viewMessage('Не удалось добавить, попробуйте снова');
				}
				
			}
		});
	}else{
		viewMessage('Дайте название отделу');
		$('#group_new_name').focus();
	}
	
});

$('#dell_new_group').click(function(){ // Удаляем отдел
	
	if(!confirm('Удалить отдел?')) return;
	
	var group_id = $('#qroup_select :selected').attr('id');
	
	if(group_id > 0){
	
		$.ajax({
			url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/add_group.php',
			type: 'POST',
			data: {group_id: group_id},
			cache: false,
			success: function(info){
			
					$('#'+group_id).remove();
					viewMessage('Отдел успешно удален');

			}
		});
	}
	
});

$('#add_new_auto_page').click(function(){
	$('#add_new_auto_page').before('<div class="autodialog_page"><div class="autodialog_url"><input type="text"  name="autodialog_url[]" placeholder="url страницы"><div class="dell_autodialog">Удалить</div><div class="updata_autodialog">Редактировать</div></div><div class="autodialog_page_close" style="display: block;"><div class="auto_settings"><div class="setting_caption">Текст приглашения в чат, для страницы</div><textarea class="autodialog_text" name="autodialog_text[]"> </textarea></div><table id="auto_settings_table"><tr><td>Показывать приглашение в чат спустя </td><td><input type="text" class="autodialog_page_show" name="autodialog_page_show[]" value="0"> секунд</td></tr><tr><td>Скрывать приглашение в чат через </td><td><input type="text" class="autodialog_pade_hide" name="autodialog_pade_hide[]" value="0" /> секунд<span style="color: #f00;">*</span></td></tr></table></div></div>');
});

$('#add_new_sistem_messages').click(function(){
	$('#add_new_sistem_messages').before('<div class="autodialog_page"><table id="auto_settings_table" style="float: left;"><tr><td>Сообщение, если консультант не ответит в течении </td><td><input type="text" name="ok_not_answer_time[]" value="0"> секунд </td></tr></table><div class="dell_not_answer">Удалить</div><div class="auto_settings"><textarea class="ok_not_answer" name="ok_not_answer[]"></textarea></div></div>');
});


$('.updata_autodialog').live('click',function(){
	$(this).parent().next().slideToggle();

});

$('.dell_autodialog').live('click',function(){
	$(this).parent().parent().fadeOut(400, function(){
		$(this).remove();
	});
});

$('.dell_not_answer').live('click',function(){
	$(this).parent().fadeOut(400, function(){
		$(this).remove();
	});
});

$('.add_operator').click(function(){
	if($('#panel_for_add_operator').css('display') == "none"){
		$('#panel_for_add_operator').slideDown();
	}else{
		$('#panel_for_add_operator').slideUp();
	}
	
});

    
  // Настройки
  
 if(enable_autodialog) $('#enable_autodialog').attr("checked", "");
 if(enable_autodialog_page) $('#enable_autodialog_page').attr("checked", "");
 if(offlinebutton) $('#offlinebutton').attr("checked", "");
 
 if(choose_qroup) $('#choose_qroup').attr("checked", "");
 if(choose_qroup_a) $('#choose_qroup_a').attr("checked", "");
 if(choose_qroup_name) $('#choose_qroup_name').attr("checked", "");
 
 if(form_name) $('#form_name').attr("checked", "");
 if(form_tell) $('#form_tell').attr("checked", "");
 if(form_email) $('#form_email').attr("checked", "");
 
 $('#color_chat_b').css('background-color', ok_chat_color);
 $('#color_chat_h').val(ok_chat_color);
 
 $('#autodialog').val(ok_autodialog);
 $('#autodialog_system_name').val(autodialog_system_name);
 $('#autodialog_revisit').val(ok_autodialog_revisit);
 $('#autodialog_time_show').val(ok_autodialog_time);
 $('#autodialog_time_hide').val(autodialog_time_hide);
 $('#autodialog_v_page').val(autodialog_v_page);
 
 $('#nocons').val(ok_noconsult);
 $('#cons_close_chat').val(cons_close_chat);
 $('#ok_view_form').val(ok_view_form);
 
 $('#'+ok_position).css('background-color', '#F5811F');
 $('#chat_position_h').val(ok_position);
 
 $('#color_chat_button_b').css('background-color', ok_button_color);
 $('#color_button_h').val(ok_button_color);
 
 
for(var i = 0; ok_autodialog_array.length > i; i++){			
		
		if(ok_autodialog_array[i].href == undefined) continue;
		
		$('.malsi_h4').after('<div class="autodialog_page"><div class="autodialog_url"><input type="text"  name="autodialog_url[]" placeholder="url страницы" value="'+ok_autodialog_array[i].href+'" /><div class="dell_autodialog">Удалить</div><div class="updata_autodialog">Редактировать</div></div><div class="autodialog_page_close"><div class="auto_settings"><div class="setting_caption">Текст приглашения в чат, для страницы</div><textarea class="autodialog_text" name="autodialog_text[]">'+ok_autodialog_array[i].text+' </textarea></div><table id="auto_settings_table"><tr><td>Показывать приглашение в чат спустя </td><td><input type="text" value="'+ok_autodialog_array[i].show_time+'" class="autodialog_page_show" name="autodialog_page_show[]"> секунд</td></tr><tr><td>Скрывать приглашение в чат через </td><td><input type="text" class="autodialog_pade_hide" name="autodialog_pade_hide[]" value="'+ok_autodialog_array[i].hide_time+'" /> секунд<span style="color: #f00;">*</span></td></tr></table></div></div>');
	
}

for(var i = 0; time_system_mess.length > i; i++){			
		
		if(jQuery.trim(time_system_mess[i].message) == "") continue;
		
		$('.s_m_after').after('<div class="autodialog_page"><table id="auto_settings_table" style="float: left;"><tr><td>Сообщение, если консультант не ответит в течении </td><td><input type="text" name="ok_not_answer_time[]" value="'+time_system_mess[i].time+'"> секунд </td></tr></table><div class="dell_not_answer">Удалить</div><div class="auto_settings"><textarea class="ok_not_answer" name="ok_not_answer[]">'+time_system_mess[i].message+'</textarea></div></div>');
	
}
 
   // Настройки
 
 
 $('.position_id').click(function(){
     
     $('.position_id').each(function(){
         $(this).css('background-color', '#7493C9');
     });
     
     $(this).css('background-color', '#F5811F');

     $('#chat_position_h').val($(this).attr('id'));
 });
 
$('.save_settings').click(function(){
	$('#settings_form').submit();
});
    
});

function closeWindows(){

    $('.close_windows').each(function(){
        $(this).css('display', 'none');
		
    });
    $('#ok_mess').remove(); //Удаляем сообщение
}

function delOperator(id_operator){
    if(!confirm('Удалить консультанта?')) return;
    $.ajax({
        url: 'http://[***!!! ЗАМЕНИТЬ НА СВОЙ ДОМЕН !!!***]/consultant/class/del_operator.php',
		type: 'GET',
		data: {id_operator: id_operator},
		cache: false,
		success: function(){
            $('#'+id_operator).fadeOut(800);
        }
	});
}

function viewMessage(mess){
	
	$('#admin_panel_message span').text(mess);
	$('#admin_panel_message').fadeIn(800);
	
	setTimeout(function(){$('#admin_panel_message').fadeOut(800);}, 2000);
}
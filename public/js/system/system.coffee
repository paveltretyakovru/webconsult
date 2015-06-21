# Отображение кнопки онлайн
$('#ok_button').addClass 'ok_online_button'
# Отображение кнопки онлайн
#$('#ok_button').addClass 'ok_offline_button'

showChat = (tmpl_name) ->
	ok_position = 'ok_left_center'
	template 	= $('#' + tmpl_name).html()

	$('#iframe').html template

	$('#ok_consultant').css 'display' , 'block'
	switch ok_position
		when 'ok_left_center'
			$('#ok_con_web_chat').animate
				'left': '0'
			, 250

hideChat = () ->
	ok_position = 'ok_left_center'

	switch ok_position
		when 'ok_left_center'
			$('#ok_con_web_chat').animate
				'left': '-340px'
			, 450 , ->
				$('#ok_consultant').css 'display', 'none'


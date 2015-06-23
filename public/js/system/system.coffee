window.App = 
	Models 		: {}
	Views 		: {}
	Collections : {}

	InitModels		: {}
	InitViews 		: {}
	InitCollections	: {}

	Helpers 		: {}

# Создаем модель чата
App.Models.Chat = Backbone.Model.extend
	urlRoot : '/consultants' ,
	
	defaults :
		configs : {}
	
	initialize : ->
		@configs = chat_configs
		console.log @configs

# Создаем представление чата
App.Views.Chat = Backbone.View.extend
	el 			: '#ok_con_web_chat'
	$ok 		: $ '#ok_button'	# Селектор кнопки чата
	open 		: false				# Открыт ли чат
	online 		: false				# Индикатор кнопки (есть ли вообще консультанты)
	client 		: {}				# Данные пользователя \
	status 		: 'offline'			# Статус чата
	consults 	: 0					# Количество консультантов онлайн
	configs 	: {}				# Параметры чата
	ip 			: ''

	initialize 	: ->
		@model.bind 'change:configs' , -> 
			@configs = @model.get 'configs'
			console.log @configs

		# Сохраняем печенечный идентификатор пользователя, определен в шаблоне
		@ip = ip

		console.log 'init view chat'	
		@updateSystem()
		# Запускаем сокеты
		@registerSocket()

	registerSocket : ->
		console.log "Initialize socket"		
		# Регестрируем
		@socket 	= io 'http://127.0.0.1:1337'
		@socket.on 'disconnect' , -> console.error 'ОТКЛЮЧИЛСЯ!'
		@socket.on 'reconnect'	, => 
			@socket.emit 'addClient' , ip : ip
			console.info 'Успешно переподключение к соккету'

		############### Отравеляем запросы #################
		@socket.emit 'addClient' , ip : ip
		####################################################

		############### Ставим прослушки сокет-событий ###################
		@socket.on 'takeCountConsultants'   , (data) => @takeCountConsultants 	data	# Получаем количество консультантов онлайн
		@socket.on 'chatStatusMessage' , (data) => @takeChatStatusMessage data 			# Получаем статус соощения от сервера для чата
		##################################################################

	takeChatStatusMessage : (data) ->
		


	# Получаем от ноды количество консультантов онлайн
	takeCountConsultants : (data) ->
		console.info 'Получили количество консультантов' , data
		# Если есть количество консультантов в онлайне
		if 'count' of data
			count = parseInt data.count
			if count
				@online = true
			else
				@online = false				
		else
			@online = false		# Нет в онлайне консультантов					

		@updateSystem()

	# Основаня логика определяющая состояние системы
	updateSystem : () ->
		# Если ввобще нет консультантов устанвливаем оффлайн форму
		if not @online
			@status = 'offline'	# При октрытии чата открываем оффлайн форму	
			@switchChatButton 0 # И выключаем кнопку на чате
		else
			# Если есть консультанты
			@switchChatButton 1	# В любом случае включаем лампочку на конпке
			@status = 'writeus'


	switchChatButton : (command) ->
		if command			
			console.log 'Online'
			@$ok.removeClass 'ok_offline_button'
			@$ok.addClass 'ok_online_button'
		else
			console.log 'Offline'
			@$ok.removeClass 'ok_online_button'
			@$ok.addClass 'ok_offline_button'

	events :
		'click #ok_button' 			: 	'okClick'		# Открыть / закрыть панель чата
		'click #ok_submit'			:	'offlineSubmit'	# Отправка оффлайн формы
		'click #ok_writeus_submit' 	: 	'writeUsSubmit'	# Отправка вопроса консультантам

	# Отправка вопроса консультантам (шаблон writeus_template.twig)
	writeUsSubmit : (e) ->
		console.log 'Отправка вопроса консультантам'

	# Отправка offline сообщения (шаблон offline_template.twig)
	offlineSubmit : (e) ->
		# Получаем данные оффлайн формы
		$element = $ e.currentTarget
		$form 	 = $element.parent 'form'
		data 	 = $form.serializeObject()

		console.log 'Отправляем новое задание' , data
		
		#### Отправляем данные формы по сокету ####
		@socket.emit 'takeOfflineTask' , data

	okClick : ->
		if @open
			@hideChat()
			@open = false
		else
			@showChat()
			@open = true

	showChat : () ->
		ok_position = 'ok_left_center'		
		template 	= $('#' + @status + '_tmpl').html()

		template = App.Helpers.Template template , @model.configs

		$('#iframe').html template

		$('#ok_consultant').css 'display' , 'block'
		switch ok_position
			when 'ok_left_center'
				$('#ok_con_web_chat').animate
					'left': '0'
				, 250

	hideChat : () ->
		ok_position = 'ok_left_center'

		switch ok_position
			when 'ok_left_center'
				$('#ok_con_web_chat').animate
					'left': '-340px'
				, 450 , ->
					$('#ok_consultant').css 'display', 'none'

		
		

############################### Инициализация ##########################
# Инициализируем модель чата
App.InitModels.Chat = new App.Models.Chat()

# Инициализируем представление чата
App.InitViews.Chat 	= new App.Views.Chat
	model : App.InitModels.Chat	
################################ TMP DATA ##############################

################################ HELPERS FUNCTIONS #####################
# Рендерит шаблоны с объектами
App.Helpers.Template = (tmpl , obj) ->
	template = _.template tmpl
	template obj

$.fn.serializeObject = ->
	o = {}
	a = @serializeArray()
	$.each a , ->
		if o[@name] != undefined
			if !o[@name].push
				o[@name] = [o[@name]]
			o[@name].push @value || ''
		else
			o[@name] = @value || ''
	o

###
	# БЛОК ЛОГИКИ ДЛЯ ЧАТА НОВОГО ДИЗАЙНА
###

# Создаем модель для одного элемента чата
App.Models.Chat = Backbone.Model.extend
	socket 			: {}
	defaults 	: ->
		data = 
		    name                : ''
		    avatar              : 'assets/img/profiles/d.jpg'
		    begin_message       : 'Сообщение заглушка'
		    count_new_messages  : 5
		    status              : 'red'

		return data


# Создаем коллекцию списков чата
App.Collections.Chats = Backbone.Collection.extend
	model : App.Models.Chat
		
# Инициализируем коллекцию списков чата
App.InitCollections.Chats = new App.Collections.Chats()

# Создаем вид для одного элемента чата
App.Views.Chat = Backbone.View.extend
	tagName 	: 'div'
	template 	: _.template $('#chat_element_template').html()
	
	initialize	: ->
		@model.bind 'destroy' , @remove , @
	
	render : ->
		@$el.html @.template @model.toJSON()
		return @
		
App.Views.ChatBody = Backbone.View.extend
	el 				: '#chat-users'
	consultant_info : {}
	socket 			: {}
	
	$consultantsGroup 	: $('#consultants-chat-group')
	$clientsGroup		: $('#clients-chat-group')
	
	initialize : ->
		console.log 'Инициализируем чат'
		@consultant_info = consultant_info;
		
		#  Получаем сокет
		@socket = App.Functions.getSocket()

		# Отправляем на ноду необходимые вызовы
		@socket.emit 'addConsultant' , @consultant_info

		# Прослушиваем необходимые события сокета
		@socket.on 'addClient' , (data) => @takeNewFromSocket data
		@socket.on 'addConsultant' , (data) => @newSocketConsultant data
		

		# Обрабатываем события объектов backbone
		App.InitCollections.Chats.bind 'add' , @addOne , @ 	# Событие добавления клиента в коллекцию
	
	addOne : (data) ->
		console.info 'Проверка нового элемента' , data
		console.log 'Добавление нового элемента чата' , data
		if 'type' of data
			 switch data.type
			 	when 'consultant'
			 		console.log 'Rendering new consultant'
			 		App.InitCollections.Chats.create data
			 		break
			 	when 'client'
			 		console.log 'Rendering new client'
			 	else 
			 		console.error 'Rendering undefined type chat group'
		else
			console.error 'Getined undefined type of chat group'
	
	takeNewFromSocket : (data) ->
		console.log 'Получен новый клиент' , data
		
	# Добавляем нового консультанта полученно по сокету
	newSocketConsultant : (data) ->
		console.log 'Получен новый консультант' , data
		data.type = 'consultant'
		@addOne data;

App.InitViews.ChatBody = new App.Views.ChatBody()
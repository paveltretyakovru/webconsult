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

# Создаем коллекчию консультантов чата
App.Collections.Consultants = Backbone.Collection.extend
	model : App.Models.Chat
App.InitCollections.Consultants = new App.Collections.Consultants()

# Создаем коллекцию клиентов чата
App.Collections.Clients		= Backbone.Collection.extend
	model : App.Models.Chat
App.InitCollections.Clients = new App.Collections.Clients()

# Создаем вид для одного элемента чата
App.Views.ChatElement = Backbone.View.extend
	tagName 	: 'div'
	template 	: _.template $('#chat_element_template').html()
	
	initialize	: ->
		@model.bind 'destroy' , @remove , @
	
	render : ->
		@$el.html @.template @model.toJSON()
		return @
		
App.Views.ConsultantsChatGroup = Backbone.View.extend
	el 				: '#consultants-chat-group'
	socket 			: {} ,
	consultant_info : consultant_info
	
	$consultantsGroup 	: $('#consultants-chat-group')
	$clientsGroup		: $('#clients-chat-grou p')
	
	initialize : ->
		console.log 'Инициализируем чат'
		
		#  Получаем сокет
		@socket = App.Functions.getSocket()

		# Отправляем на ноду необходимые вызовы
		@socket.emit 'addConsultant' , @consultant_info
		
		@socket.on 'addConsultant' 	, (data) -> App.InitCollections.Consultants.create data
		@socket.on 'addClient'		, @addClient
		
		@socket.on 'create' , (data) -> console.log 'test create' , data

		# Обрабатываем события объектов backbone
		App.InitCollections.Consultants.on 'add' 	, @addOneConsultant , @		# Событие добавление консультанта в коллекцию
		App.InitCollections.Clients.on 	'add' 		, @addOneClient , @			# Событие добавление клиента в коллекцию
	
	addOneConsultant : (model , collection , options) ->
		console.info 'Добавление новго консультанта чат' , model.toJSON()
		view = new App.Views.ChatElement model : model
		@$el.append view.render().el
		#$('#messages-wrapper').html('test');
		

App.InitViews.ConsultantsChatGroup = new App.Views.ConsultantsChatGroup()

# Добавляем текущего консультанта в общий список
App.InitCollections.Consultants.create consultant_info
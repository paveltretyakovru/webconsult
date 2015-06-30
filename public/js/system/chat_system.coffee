###
	# БЛОК ЛОГИКИ ДЛЯ ЧАТА НОВОГО ДИЗАЙНА
###

# Создаем модель для одного элемента чата
App.Models.Chat = Backbone.Model.extend
	socket 		: {}
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
		console.log 'test'
		@model.bind 'destroy' , @remove , @
	
	render : ->
		@$el.html @.template @model.toJSON()
		return @
		
App.Views.ChatBody = Backbone.View.extend
	el 		: '#chat-users'
	socket 	: {}
	
	initialize : ->
		console.log 'Инициализируем чат'
		
		#  Получаем сокет
		@socket = App.Functions.getSocket()

		# Отправляем на ноду необходимые вызовы
		@socket.emit 'addConsultant'

		# Прослушиваем необходимые события сокета
		@socket.on 'addClient' , (data) => @takeNewFromSocket data

		# Обрабатываем события объектов backbone
		App.InitCollections.Chats.bind 'add' , @addOne , @ 	# Событие добавления клиента в коллекцию
	
	addOne : -> console.log 'add one chat'

App.InitViews.ChatBody = new App.Views.ChatBody()
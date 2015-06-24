window.App =
	Models 			: {}
	Views 			: {}
	Collections 	: {}

	InitViews 		: {}
	InitModels		: {}
	InitCollections	: {}

	Objects 		: {
		socket : {}
	}
	Functions 		: {}

# Функция возвращает объект сокета
App.Functions.getSocket = ->
	if Object.keys App.Objects.socket
		console.log 'Инициализация сокета'
		App.Objects.socket = io 'http://127.0.0.1:1337'
	else
		console.log 'Возвращаем объект сокета'
		return App.Objects.socket

# Модель для онлайн клиента
App.Models.OnlineClient = Backbone.Model.extend
	defaults : ->
		ip 		: ""
		name 	: ""
		phone 	: ""
		message : ""

	initialize : -> console.log "Инициализация модели онлайн пользователя"

	clear : ->
		@destroy()

# Коллекция с онлайн клиентами
App.Collections.OnlineClients = Backbone.Collection.extend
	model : App.Models.OnlineClient

	localStorage : 

# Инициализируем коллекцию с олнайлн пользователями
App.InitCollections.OnlineClients = new App.Collections.OnlineClients

# Представление для одно пользователя
App.Views.OnlineClient = Backbone.View.extend
	tagName : 'tr'

	template : _.template $('#online_user_template').html()

	events :
		'click .init_single_chat' : 'initSingleChat'	# Клик на ссылку для инициализации чата с пользователем

	initialize : ->
		# События модели
		@model.bind 'destroy' , @remove , @

	render : ->
		@$el.html @.template @model.toJSON()
		return @

	### ~~~~~~~~~~~~~~~~~~~~~~~ Дополнительные функции ~~~~~~~~~~~~~~~~~~~~~~~ ###
	initSingleChat : ->
		console.log 'Инициализируем чат'

App.Views.OnlineClientsTable = Backbone.View.extend
	el 		: '#users_online_table'
	socket 	: {}

	initialize : ->
		console.log 'Инициализируем таблицу онлайн пользователей'

		#  Получаем сокет
		@socket = App.Functions.getSocket()

		# Отправляем на ноду необходимые вызовы
		@socket.emit 'addConsultant'

		# Прослушиваем необходимые события сокета
		@socket.on 'addClient' , (data) => @takeNewFromSocket data

		# Обрабатываем события объектов backbone
		App.Collections.OnlineClients.bind 'add' , @addOne , @ 	# Событие добавления клиента в коллекцию

	# Добавление нового клиента в таблицу по событию коолекции - добавлена новая модель
	addOne : (OnlineClientModel) ->
		view = new App.Views.OnlineClient OnlineClientModel
		@$el.append view.render().el

	# Получили данные о новом клиенте с сокета
	takeNewFromSocket : (socket_data) ->
		console.log "Через сокет получен новый клиент" , socket_data
		App.InitCollections.OnlineClients.create socket_data

App.InitViews.OnlineClientsTable = new App.Views.OnlineClientsTable
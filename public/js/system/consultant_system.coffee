window.App =
	Models 			: {}
	Views 			: {}
	Collections 	: {}

	InitViews 		: {}
	InitModels		: {}
	InitCollections	: {}

App.Models.Chat = Backbone.Model.extend
	initialize : ->
		console.log "Initialize chat"

App.Views.Chat = Backbone.View.extend
	el 		: '#el'
	socket 	: {}

	initialize : ->
		console.log 'Инициализируем соккеты'
		@initSockets()

	initSockets : ->
		# Создаем объект сокетов
		@socket = io 'http://127.0.0.1:1337'

		# Отправляем запросы
		@socket.emit 'addConsultant'

		# Получаем запросы
		@socket.on 'addClient' , (data) => @addClientToList data

	addClientToList : (data) ->
		console.log 'New client' , data

App.InitModels.Chat = new App.Models.Chat();
App.InitViews.Chat 	= new App.Views.Chat model : App.InitModels.Chat
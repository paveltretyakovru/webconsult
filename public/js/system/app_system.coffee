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
	Data			: 
		serverhost	: 'https://webconsult-ptretyakov.c9.io/'
		sockethost	: 'https://webconsult-node-server-ptretyakov.c9.io'

# Функция возвращает объект сокета
App.Functions.getSocket = ->
	if Object.keys App.Objects.socket
		console.log 'Инициализация сокета'
		App.Objects.socket = io App.Data.sockethost
	else
		console.log 'Возвращаем объект сокета'
		return App.Objects.socket
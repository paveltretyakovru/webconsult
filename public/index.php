<?php
require __DIR__."/../vendor/autoload.php";
require __DIR__."/../config/register.php";

$app->get('/' , 'users.controller:index');

$app->get('/consultants/{id}' , 'consultants.controller:get');
$app->get('/consultants' , 'consultants.controller:index');
$app->get('/consultants/offline' , 'consultants.controller:offline');

$app->get('/chat/getconfig' , 'chat.controller:getConfigs');

$app->post('/tasks' , 'tasks.controller:store');

$app->get('/info' , function(){
	return phpinfo();
});

$app->run();
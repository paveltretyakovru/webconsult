<?php
require __DIR__."/../vendor/autoload.php";
require __DIR__."/../config/register.php";

$app->get('/' , function() use($app){
	return $app['twig']->render('index.twig');
});

$app->get('/consultants/{id}' , 'consultants.controller:get');
$app->get('/consultants' , 'consultants.controller:panel');

$app->run();
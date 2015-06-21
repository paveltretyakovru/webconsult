<?php
require __DIR__."/../vendor/autoload.php";
require __DIR__."/../config/register.php";

$app->get('/' , function() use($app){
	return $app['twig']->render('index.twig');
});

$app->run();
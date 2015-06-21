<?php
require __DIR__."/../vendor/autoload.php";
require __DIR__."/../config/register.php";

$app->get('/' , function(){
	return "Main page";
});

$app->run();
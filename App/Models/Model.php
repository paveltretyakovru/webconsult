<?php
namespace App\Models;

/**
* Базовый класс для моделей
*/
class Model
{
	public function __construct($app){
		$this->app = $app;
	}	
}
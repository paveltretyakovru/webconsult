<?php
namespace App\Controllers;

/**
* Базовый класс для контроллеров
* @author Pavel Tretyakov <tretyakovpave.ru@gmail.com>
* @copyright 2015
*/
class Controller
{
	/**
	 * @param object $app : Объект приложения системы
	 */
	public function __construct($app)
	{
		$this->app = $app;
	}

	public $app;
}
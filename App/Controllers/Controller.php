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

	protected function generatePassword($length = 8){
		$chars = 'abdefhiknrstyzABDEFGHKNQRSTYZ23456789';
		$numChars = strlen($chars);
		$string = '';
		
		for ($i = 0; $i < $length; $i++) {
			$string .= substr($chars, rand(1, $numChars) - 1, 1);
		}
		return $string;
	}

	public $app;
}
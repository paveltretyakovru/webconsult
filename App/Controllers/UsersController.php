<?php
namespace App\Controllers;

use App\Controllers\Controller;

/**
* Контроллер отвечающий за пользовательские моменты
* @author Pavel Tretyakov <tretyakovpavel.ru@gmail.com>
* @copyright 2015
*/
class UsersController extends Controller
{
	
	/**
	 * Метод обрабатывает главный пользовательский маршрут
	 * @return twig temlate
	 */
	public function index(){

		$chat_configs 	= $this->app['chat.controller']->getConfigs(true);
		$cookie_id 		= $this->controllCookie();

		return $this->app['twig']->render('index.twig' , compact('chat_configs' , 'cookie_id'));
	}

	/**
	 * Устанавливаем печеньки у пользователя
	 */
	private function controllCookie(){
		if(!isset($_COOKIE['cookie_id'])){
			$cookie_id = $this->generatePassword(15);
			setcookie('cookie_id' , $cookie_id , time()+60*60*24*60 , '/'); # 60 дней
			return $cookie_id;
		}else{
			return $_COOKIE['cookie_id'];
		}
	}
}
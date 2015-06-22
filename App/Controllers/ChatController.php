<?php
namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\Chat;

/**
* Класс управляющий данными чатов
* @author Pavel Tretyakov <tretjakov.pavel@gmail.com>
* @copyright 2015
*/
class ChatController extends Controller
{
	/**
	 * Собарает информацию для 
	 */
	public function getConfigs($encode = false){
		$Chat = new Chat($this->app);
		
		if (!$encode) {
			return $this->app->json($Chat->getConfigs());
		} else {
			return json_encode($Chat->getConfigs() , JSON_UNESCAPED_UNICODE);
		}
		
	}
}
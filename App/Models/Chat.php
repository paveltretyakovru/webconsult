<?php
namespace App\Models;

use App\Models\Model;

/**
* Модель для чатов
* @author Pavel Tretyakov <tretjakov.pavel@gmail.com>
*/
class Chat extends Model
{
	public function getConfigs(){
		$query 	= "SELECT `key` , `value` FROM `chatconfigs`";
		$data 	= $this->app['pdo']->query($query)->fetchAll(\PDO::FETCH_KEY_PAIR);
		return $data;
	}
}
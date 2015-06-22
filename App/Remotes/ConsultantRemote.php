<?php
namespace App\Remotes;

use App\Remotes\Remote;

/**
* Класс для получения удаленных данных о консультанте
* @author Pavel Tretyakov <tretyakovpavel.ru@gmail.com>
* @copyright 2015
*/
class ConsultantRemote extends Remote
{
	static function getFreeConsultant(){
		return file_get_contents('http://api.lptracker.ru/users/auth?key=consult_api_ASKJH$AS&auth=d2a44d61fbc21ce89caafcd7a410c825');
	}
}
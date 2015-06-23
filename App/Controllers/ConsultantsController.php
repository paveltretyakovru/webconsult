<?php 

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\Consultant;
use App\Models\Task;
use App\Remotes\ConsultantRemote;

/**
* Контроллер управляющий логикой консультантов
* @author Pavel Tretyakov <tretyakovpave.ru@gmail.com>
* @copyright 2015
*/
class ConsultantsController extends Controller
{
	/**
	 * Открываем панель консультанта
	 * @return twig template
	 */
	public function index(){
		$Task 	= new Task($this->app);

		$tasks 	= $Task->selectAll();

		return $this->app['twig']->render('consultant.twig' , compact('tasks'));
	}
	
	/**
	 * Получает данные о консультанте, елси id == 0 , получает свободного консультанта
	 * @return JSON $consultant : объект консультанта
	 */
	public function get($id){
		$consultant = [];

		// Идет запрос есть ли консультанты в онлайне
		if ($id == -1) {
			$consultant = $this->issetConsultant();
		}

		if(!$id){
			$consultant = $this->getFreeConsultant();
		}

		return $consultant;
	}

	/**
	 * Метода проверяет наличие консультантов в сети
	 * @return JSON : id->0, если есть консультанты, в противном случае id->-1
	 */
	private function issetConsultant(){
		return $this->app->json(['id' => 0]);
	}

	/**
	 * Метод возвращает объект свободного консультанта
	 * @return JSON $consulant : объект консультанта если удалось получить, иначе JSON[id]-> -1
	 */
	private function getFreeConsultant(){
		$consultant = ConsultantRemote::getFreeConsultant();

		if(!$consultant){
			$consultant = $this->app->json(['id' => -1]);
		}	

		return $consultant;
	}
}
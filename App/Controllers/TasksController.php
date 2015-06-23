<?php
namespace App\Controllers;

use Symfony\Component\HttpFoundation\Request;
use App\Controllers\Controller;
use App\Models\Task;

/**
* Контроллер для управления задачаи
*/
class TasksController extends Controller
{
	public function store(Request $request){
		$Task = new Task($this->app);

		$data = [
			'name' 		=> $request->get('name'),
			'phone' 	=> $request->get('phone'),
			'message' 	=> $request->get('message'),
			'ip'		=> $request->get('ip')
		];

		return $Task->insert($data);
	}
}
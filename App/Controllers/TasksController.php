<?php
namespace App\Controllers;

use Symfony\Component\HttpFoundation\Request;
use App\Controllers\Controller;

/**
* Контроллер для управления задачаи
*/
class TasksController extends Controller
{
	public function store(Request $request){
		return "Hello from store task ^_^" . $request->get('message');
	}
}
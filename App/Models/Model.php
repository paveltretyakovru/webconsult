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

	public function selectAll(){
		$return = [];

		$stmt = $this->app['pdo']->query("SELECT * FROM {$this->table}");
		while ($row = $stmt->fetch()){
			$return[] = $row;
		}

		return $return;

	}

	protected function pdoSet($fields) {
		$set = '';

		foreach ($fields as $key => $value) {
			//$set.="`".str_replace("`","``",$key)."`". "=:$key, ";
			if(!empty($value)){
				$set.= $key . " = :{$key} , ";
			}
		}
		return substr($set, 0, -2);
	}

	public function insert($data){

		$sql = "INSERT INTO {$this->table} SET ".$this->pdoSet($data);

		echo "Выполняется запрос к базе данных: ".$sql;

		$sql_array = array();
		foreach ($data as $key => $value) {
			if(!empty($value)){
				$sql_array[':'.$key] = $value;
			}
		}

		$stm = $this->app['pdo']->prepare($sql , array(\PDO::ATTR_CURSOR => \PDO::CURSOR_FWDONLY));

		if($stm->execute($sql_array)){
			echo "Запись успешно добавлена";
			return true;
		}else{
			echo "Произошла ошибка во время добавления записи в базу данных";
			print_r($this->app['pdo']->errorInfo());
			return false;
		}
	}

	public function update($data , $id){
		foreach ($data as $key => $value) {
			$fields = $key;
		}

		if (is_array($id)){
			foreach ($id as $key => $value) {
				$id_name 	= $key;
				$id_value 	= $value;
			}
		}else{
			$id_name 	= 'id';
			$id_value 	= $id;
		}

		$sql 			= "UPDATE `{$this->table}` SET ".$this->pdoSet($fields)." WHERE {$id_name} = :id";

		$stm 			= $this->app['pdo']->prepare($sql , array(\PDO::ATTR_CURSOR => \PDO::CURSOR_FWDONLY));
		$values["id"] 	= $id_value;

		return $stm->execute($data);
	}
}
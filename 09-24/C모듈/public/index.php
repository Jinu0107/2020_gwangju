<?php

use src\App\Route;

date_default_timezone_set("Asia/Seoul");

session_start();

define('__DS', DIRECTORY_SEPARATOR);
define('__ROOT', dirname(__DIR__));
//__DIR__는 PHP 마법상수중에 하나로 현재 디렉토리를 나타낸다
//여기서는 public 폴더가 __DIR__이 된다
// dirname은 상위폴더를 의미하는 걸로 public폴더의 상위폴더를 구하니까
// 여기서는 htdocs가 된다
define('__SRC', __ROOT . __DS . "src");
define('__VIEWS', __SRC . __DS . "views");
define('__IMAGE', dirname(__ROOT . '../') . "/festivalImages");


require_once(__ROOT . __DS . "autoload.php"); //오토로더를 불러온다.
require_once __ROOT . __DS . "web.php"; //라우팅 주소를 불러온다.


Route::init();

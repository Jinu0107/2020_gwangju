<?php

function myLoader($name){
    require_once(__ROOT . __DS . str_replace("\\" , "/" , $name) . ".php");
}

spl_autoload_register("myLoader");
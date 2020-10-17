<?php



namespace src\App;


class Library
{
    public static function sendJson($data)
    {
        // header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }


    public static function msgAndGo($msg, $url)
    {
        echo "<script> alert('$msg'); location.href= '$url' </script>";
    }

    public static function ckeckUser()
    {
        return isset($_SESSION['user']);
    }

    
}

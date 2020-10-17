<?php

namespace src\Controller;

use src\App\Library;

class UserController
{
    public function login()
    {
        extract($_POST);
        if ($id == 'admin' && $pass == 'admin') {
            Library::msgAndGo("로그인 성공", '/');
            $_SESSION['user'] = true;
        } else {
            Library::msgAndGo("로그인 실패", '/login_page');
        }
    }

    public function logout()
    {
        unset($_SESSION['user']);
        Library::msgAndGo("로그아웃 성공", '/');
    }
}

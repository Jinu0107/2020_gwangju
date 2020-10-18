<?php


namespace src\Controller;

use src\App\DB;
use src\App\Library;

class MainController extends MasterController
{


    public static function init()
    {
        $result = DB::fetchAll("SELECT * FROM festivals");
        if (count($result) == 0) {
            DB::execute("DELETE FROM festivals");
            DB::execute("DELETE FROM files");

            $xml = simplexml_load_file("http://localhost/xml/festivalList.xml");
            foreach ($xml->items->item as $ket => $item) {
                $data = [null, $item->no, $item->nm, $item->area, $item->dt, $item->location, $item->cn];
                $result = DB::execute("INSERT INTO festivals(idx, no, name, area, date, location, content) VALUES(?, ?, ?, ?, ?, ?, ?)", $data);

                $idx = DB::fetch("SELECT MAX(idx) as 'idx' FROM festivals")->idx;
                $item->sn = str_pad($item->sn, 3, "0", STR_PAD_LEFT);
                foreach ($item->images->image as $key => $value) {
                    DB::execute("INSERT INTO files(pidx , name , type, path) value (?,?,?,?)", [$idx, $value, 1, $item->sn . "_" . $item->no]);
                }
            }
        }
    }

    public function index()
    {
        $this->render("main");
    }

    public function current()
    {
        $this->render("current");
    }

    public function festival()
    {
        $this->render("festival");
    }
    public function sub()
    {
        $this->render("sub");
    }
    public function login_page()
    {
        $this->render("login_page");
    }

    public function festivalCS()
    {
        $result = DB::fetchAll("SELECT * FROM festivals");
        foreach ($result as $item) {
            $cnt = DB::fetch("SELECT count(*) as cnt from files WHERE pidx = ?", [$item->idx])->cnt;
            $item->cnt = $cnt;
        }
        $this->render("festivalCS", [$result]);
    }

    public function update()
    {
        $idx = $_GET['idx'];
        if (!Library::ckeckUser()) {
            Library::msgAndGo("로그인한 유저만 이용할 수 있습니다.", "/festivalCS");
            return;
        }
        $result = DB::fetch("SELECT * FROM festivals WHERE idx = ?", [$idx]);
        $images = DB::fetchAll("SELECT * FROM files WHERE pidx = ?", [$idx]);
        $this->render("update", [$result, $images]);
    }

    public function insert()
    {
        $this->render("insert");
        
    }
}

MainController::init();

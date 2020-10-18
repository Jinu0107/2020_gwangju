<?php

namespace src\Controller;

use src\App\DB;
use src\App\Library;
use ZipArchive;

class FestivalController
{
    public function down()
    {
        extract($_GET);
        $dbfiles = DB::fetchAll("SELECT * FROM files WHERE pidx = ?", [$idx]);
        $download_name = $dbfiles[0]->pidx . "." . $type;
        $cnt = 0;
        foreach ($dbfiles as $file) {
            if ($file->type == 1) {
                //기존에 구축된 데이터일 경우
                $path = __IMAGE . "/$file->path/$file->name";
                $file->download_path = $path;
            } else {
                $path = __IMAGE . "/$file->name";
                $file->download_path = $path;
            }

            if (file_exists($file->download_path)) {
                $cnt++;
            }
        }
        if ($cnt == 0) {
            Library::msgAndGo("다운로드 할 이미지 파일이 없습니다.", "/festivalCS");
        } else {
            if ($type == 'zip') {
                $zip = new ZipArchive();
                $zip->open($download_name, ZipArchive::CREATE);
                foreach ($dbfiles as $file) {
                    $zip->addFile($file->download_path, $file->name);
                }
                $zip->close();
            } else if ($type == 'tar') {
                $tar = new \PharData($download_name);
                foreach ($dbfiles as $file) {
                    $tar->addFile($file->download_path, $file->name);
                }
            } else {
                Library::msgAndGo("다운로드 에러", "/festivalCS");
            }

            header("Content-Disposition: attachment; filename=$download_name");
            header("Content-length: " . filesize($download_name));
            readfile("$download_name");
            sleep(1);
            unlink($download_name);
        }
    }

    public function update()
    {
        $idx = $_POST['idx'];
        $name = $_POST['name'];
        $area = $_POST['area'];
        $date = $_POST['date'];
        $location = $_POST['location'];

        $delete_img = $_POST['delete_img'];
        $files = $_FILES['add_img'];

        var_dump($files);

        $data = [$name, $area, $date, $location, $idx];
        $data = array_map("trim", $data);

        if (in_array("", $data)) {
            Library::msgAndGo("필수값이 비어있습니다.", "/festivalCS");
            return;
        }

        if (!preg_match("/^[0-9]{4}-[0-9]{2}-[0-9]{2} ~ [0-9]{4}-[0-9]{2}-[0-9]{2}$/", $date)) {
            Library::msgAndGo("날짜 형식이 잘못되었습니다.", "/festivalCS");
            return;
        }

        DB::execute("UPDATE festivals SET name = ? , area = ? , date = ? , location = ? WHERE idx = ?", $data);
        if (count($delete_img) != 1) {
            foreach ($delete_img as $img_idx) {
                DB::execute("DELETE from files WHERE idx = ?", [$img_idx]);
            }
        }
        $pidx = $idx;
        if ($files['name'][0] != "") {
            foreach ($files['name'] as $key => $value) {
                $exit = strtolower(explode(".", $value)[count(explode(".", $value)) - 1]);
                echo $exit;
                if ($exit != "jpg" && $exit != "png" && $exit != "gif") {
                    continue;
                }
                $filename = time() . "_" . $value;
                $array = [$pidx, $filename, 0, ""];
                DB::execute("INSERT INTO files(pidx , name , type, path) value (?,?,?,?)", $array);
                move_uploaded_file($files['tmp_name'][$key], __IMAGE . "/$filename");
            }
        }

        Library::msgAndGo("성공적으로 수정되었습니다.", "/festivalCS");
    }


    public function delete()
    {
        $idx = $_GET['idx'];
        DB::execute("DELETE FROM festivals WHERE idx = ?", [$idx]);
        Library::msgAndGo("성공적으로 삭제 되었습니다.", "/festivalCS");
    }

    public function insert()
    {
        $name = $_POST['name'];
        $area = $_POST['area'];
        $date = $_POST['date'];
        $location = $_POST['location'];
        $files = $_FILES['add_img'];

        $data = [$name, $area, $date, $location];
        $data = array_map("trim", $data);
        if (in_array("", $data)) {
            Library::msgAndGo("필수값이 비어있습니다.", "/festivalCS");
            return;
        }
        if (!preg_match("/^[0-9]{4}-[0-9]{2}-[0-9]{2} ~ [0-9]{4}-[0-9]{2}-[0-9]{2}$/", $date)) {
            Library::msgAndGo("날짜 형식이 잘못되었습니다.", "/festivalCS");
            return;
        }
        $array = [null, 123, $name, $area, $date, $location, ""];
        DB::execute("INSERT INTO festivals(idx, no, name, area, date, location, content) VALUES(?, ?, ?, ?, ?, ?, ?)", $array);

        $pidx = DB::lastId();

        if ($files['name'][0] != "") {
            foreach ($files['name'] as $key => $value) {
                $exit = strtolower(explode(".", $value)[count(explode(".", $value)) - 1]);
                echo $exit;
                if ($exit != "jpg" && $exit != "png" && $exit != "gif") {
                    continue;
                }
                $filename = time() . "_" . $value;
                $array = [$pidx, $filename, 0, ""];
                DB::execute("INSERT INTO files(pidx , name , type, path) value (?,?,?,?)", $array);
                move_uploaded_file($files['tmp_name'][$key], __IMAGE . "/$filename");
            }
        }

        Library::msgAndGo("성공적으로 추가되었습니다.", "/festivalCS");
    }
}

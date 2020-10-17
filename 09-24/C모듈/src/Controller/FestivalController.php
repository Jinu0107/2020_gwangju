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
}

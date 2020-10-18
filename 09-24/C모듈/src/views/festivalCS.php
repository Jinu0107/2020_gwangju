<?php

use src\App\Library; ?>


<div class="festivalCS section">
    <div class="container">
        <div class="section_title center">
            <hr>
            <h1><span class="bold">JEONBUK</span> FESTIVAL</h1>
            <p>축제 현황 - 목록</p>
        </div>
        <div class="btn_group flex_e">
            <?php if (Library::ckeckUser()) : ?>
                <a href="/insert"><button class="btn0 btn1">축제 등록</button></a>
            <?php endif; ?>
        </div>
        <table class="table">
            <thead>
                <th width="7%">번호</th>
                <th width="35%">축제명(사진 수)</th>
                <th width="20%">다운로드</th>
                <th width="20%">기간</th>
                <th width="10%">장소</th>
            </thead>
            <tbody>
                <!-- <tr>
                    <td><a href="" class="black_a">1</a></td>
                    <td><a href="" class="black_a">2017 WTF 세계태권도선수권대회 <span class="tag">4</span></a></td>
                    <td><a href="" class="btn0 btn1" style="color: #fff;">tar</a> <a href="" class="btn0 btn1" style="color: #fff;">zip</a></td>
                    <td>2020.04.30~05.05</td>
                    <td><span class="tag">남원</span></td>
                </tr> -->
            </tbody>
        </table>

        <div class="pagination_group flex_c">
        </div>
    </div>
</div>
<script>
    const datas = <?= Library::sendJson($data[0]) ?>;
</script>

<script src="/resources/js/FestivalCS.js"></script>
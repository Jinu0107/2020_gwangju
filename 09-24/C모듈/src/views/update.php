<div class="update section">
    <div class="container">
        <div class="section_title center">
            <hr>
            <h1><span class="bold">FESTIVAL</span> UPDATE</h1>
            <p>축제 현황 - 축제 수정 페이지</p>
        </div>
        <form action="/update_process" method="post" enctype='multipart/form-data'>
            <input type="hidden" name="idx"value="<?= $data[0]->idx ?>">
            <div class="form_box">
                <div class="form-group">
                    <label for="">축제명</label>
                    <input type="text" name="name" class="form-control" value="<?= $data[0]->name ?>">
                </div>
                <div class="form-group row">
                    <div class="col-lg-6">
                        <label for="">지역</label>
                        <input type="text" name="area" class="form-control" value="<?= $data[0]->area ?>">
                    </div>
                    <div class="col-lg-6">
                        <label for="">기간</label>
                        <input type="text" name="date" class="form-control" value="<?= $data[0]->date ?>">
                    </div>
                </div>
                <div class="form-group">
                    <label for="">장소</label>
                    <input type="text" name="location" class="form-control" value="<?= $data[0]->location ?>">
                </div>
                <div class="form-group">
                    <label for="">축제 사진</label> <span class="small">삭제하고 싶은 사진을 선택 후 삭제 가능</span>
                    <div class="image_group">
                        <input type="checkbox" name="delete_img[]" value="temp" style="display: none;" checked>
                        <?php foreach ($data[1] as $img) : ?>
                            <div>
                                <input type="checkbox" name="delete_img[]" value="<?= $img->idx ?>"> <span><?= $img->name ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="form-group">
                    <label for="">추가 사진</label>
                    <div class="custom-file">
                        <input type="file" name="add_img[]"  class="custom-file-input" id="file_input" multiple>
                        <label for="file_input" class="custom-file-label">컨트롤을 누른 후 다중선택 가능</label>
                    </div>
                </div>
                <div class="btn_group flex_e">
                    <a href="/delete_process?idx=<?= $data[0]->idx ?>"><button class="btn0 btn1" type="button">삭제</button></a>
                    <button class="btn0 btn2">저장</button>
                </div>
            </div>
        </form>
    </div>
</div>



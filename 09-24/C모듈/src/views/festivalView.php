<div class="festivalView section">
    <div class="container">
        <div class="section_title center">
            <hr>
            <h1><span class="bold">FESTIVAL</span> VIEW</h1>
            <p>축제 상세 정보</p>
        </div>
        <div class="title"><?= $data[0]->name ?></div>
        <div class="info">
            <div class="img_box">
                <?php

                use src\App\Library;

                if (count($data[1]) != 0) : ?>
                    <?php if ($data[1][0]->path == "") : ?>
                        <img src="/getImage?folder=null&img=<?= $data[1][0]->name ?>" alt="No Image">
                    <?php else : ?>
                        <img src="/getImage?folder=<?= $data[1][0]->path ?>&img=<?= $data[1][0]->name ?>" alt="No Image">
                    <?php endif; ?>
                <?php else :  ?>
                    <img src="" alt="No Image">
                <?php endif; ?>
            </div>
            <div class="text">
                <table class="table">
                    <tr>
                        <th width="30%">지역</th>
                        <th width="70%" class="area"><?= $data[0]->area ?></th>
                    </tr>
                    <tr>
                        <th width="30%">장소</th>
                        <th width="70%" class="location"><?= $data[0]->location ?></th>
                    </tr>
                    <tr>
                        <th width="30%">기간</th>
                        <th width="70%" class="dt"><?= $data[0]->date ?></th>
                    </tr>
                </table>
                <p class="cn">
                    <?= $data[0]->content ?>
                </p>
            </div>
        </div>
        <div class="section_title">
            <hr>
            <h1>축제 사진</h1>
        </div>
        <div class="sub_img_box">
            <?php foreach ($data[1] as $img) : ?>
                <?php if ($img->path == "") : ?>
                    <img src="/getImage?folder=null&img=<?= $img->name ?>" alt="No Image">
                <?php else : ?>
                    <img src="/getImage?folder=<?= $img->path ?>&img=<?= $img->name ?>" alt="No Image">
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
        <div class="section_title">
            <hr>
            <h1>축제 후기</h1>
        </div>
        <div class="flex_e">
            <button class="btn0 btn1" onclick="modal_open()">후기 등록</button>
        </div>
        <div class="review_box">
            <?php foreach ($data[2] as $review) : ?>
                <div class="review_item flex_b">
                    <div class="review_left">
                        <div class="name_group">
                            <p><?= $review->name ?></p>
                            <span>
                                <?php for ($i = 0; $i < $review->score; $i++) : ?>
                                    <i class="fa fa-star"></i>
                                <?php endfor; ?>
                            </span>
                        </div>
                        <div class="text">
                            <?= $review->comment ?>
                        </div>
                    </div>
                    <div class="review_right flex_c">
                        <?php if (Library::ckeckUser()) : ?>
                            <a href="/review_delete?idx=<?= $review->idx ?>"><button class="btn0 btn2">삭제</button></a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>



<div class="custom_modal">
    <div class="inner w_700 ab_c">
        <div class="close_btn">&times;</div>
        <h5 class="bold">후기등록</h5>
        <form action="/review_process" method="post">
            <input type="hidden" name="idx" value="<?= $data[0]->idx ?>">
            <div class="form-group row">
                <div class="col-lg-6">
                    <label for="">이름</label>
                    <input type="text" name="name" class="form-control">
                </div>
                <div class="col-lg-6">
                    <label for="">별점</label>
                    <select name="score" class="form-control">
                        <option value="">선택해주세요</option>
                        <option value="1">★</option>
                        <option value="2">★★</option>
                        <option value="3">★★★</option>
                        <option value="4">★★★★</option>
                        <option value="5">★★★★★</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="">후기</label>
                <input type="text" name="comment" class="form-control">
            </div>
            <div class="flex_e">
                <button class="btn0 btn1">후기 등록</button>
            </div>
        </form>
    </div>
</div>



<script>
    function modal_open() {
        $(".custom_modal").fadeIn();
    }

    document.querySelector(".close_btn").addEventListener("click", (e) => {
        $(e.currentTarget.parentNode.parentNode).fadeOut();
    });
</script>
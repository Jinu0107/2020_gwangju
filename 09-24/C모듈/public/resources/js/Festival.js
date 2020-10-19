window.addEventListener('load', () => {
    window.festival = new Festival();
});

class Festival {
    constructor() {
        this.xml;
        this.datas;
        this.$btns = $(".j_festival .page_btn_group");
        this.$content = $('.j_festival .content');
        this.$modal = $("#view_modal");
        this.init();
    }

    async init() {
        this.xml = await this.getXML();
        this.datas = this.getDatas();

        $("#view_modal").dialog({
            'width': 800,
            'my': 'center',
            'at': 'center',
            'show': true,
            'hidden': true,
            'modal': true,
            "autoOpen": false,
        });

        this.render();
        this.addEvent();
    }

    getXML() {
        return $.ajax('/xml/festivalList.xml');
    }

    getDatas() {
        return Array.from(this.xml.querySelectorAll("item")).map(item => {
            return {
                id: item.querySelector("sn").innerHTML,
                no: item.querySelector("no").innerHTML,
                nm: item.querySelector("nm").innerHTML,
                area: item.querySelector("area").innerHTML,
                location: item.querySelector("location").innerHTML,
                dt: item.querySelector("dt").innerHTML,
                cn: item.querySelector("cn").innerHTML,
                images: Array.from(item.querySelectorAll("image")).map(x => x.innerHTML),
                image_path: `/xml/festivalImages/${item.querySelector("sn").innerHTML.padStart(3, "0")}_${item.querySelector("no").innerHTML}`,
                c_image : `${item.querySelector("sn").innerHTML.padStart(3, "0")}_${item.querySelector("no").innerHTML}`
            };
        });
    }

    render() {
        let qs = this.getQueryString();

        let page = qs.page * 1;
        let type = qs.searchType;

        page = isNaN(page) || !page || page < 1 ? 1 : page;
        type = ['album', 'list'].includes(type) ? type : 'album';

        document.querySelectorAll(".festival_btns").forEach(x => {
            if (x.dataset.type == type) {
                x.classList.remove("disable");
            } else {
                x.classList.add("disable");
            }
        });

        const ITEM_COUNT = type == "album" ? 6 : 10;
        const BTN_COUNT = 5;

        let totalPage = Math.ceil(this.datas.length / ITEM_COUNT);
        let currendBlock = Math.ceil(page / BTN_COUNT);
        let start = currendBlock * BTN_COUNT - BTN_COUNT + 1;
        start = start < 1 ? 1 : start;
        let end = start + BTN_COUNT - 1;
        end = end > totalPage ? totalPage : end;
        let prev = start - 1 > 1;
        let next = end + 1 < totalPage;

        let start_idx = (page - 1) * ITEM_COUNT;
        let end_idx = start_idx + ITEM_COUNT;
        let viewList = this.datas.slice(start_idx, end_idx);
        let htmlBtns = "";
        for (let i = start; i <= end; i++) {
            htmlBtns += `<a href="?page=${i}&searchType=${type}" class="${page == i ? 'active' : ''}">${i}</a>`;
        }
        this.$btns.html(`<a href="?page=${start - 1}&searchType=${type}" class="${!prev ? "disable" : ""}">&lt</a>
                ${htmlBtns}
                <a href="?page=${end + 1 > totalPage ? page : end + 1}&searchType=${type}" class="${!next ? "disable" : ""}">&gt</a>
        `);

        if (type == 'album') this.drawAlbum(viewList);
        else this.drawList(viewList);
    }


    addEvent() {
        this.$content.on("click", "[data-target='.view_modal']", this.openFestivalModal);
        $(document).on("click", ".pagination > button ", this.modalBtnClick);
    }

    modalBtnClick = e => {
        let value = e.currentTarget.dataset.value * 1;
        let imgLen = this.$modal.find(".slide_pannel > img").length;
        let cno = this.$modal.data("sno");
        let sno;
        if (e.currentTarget.classList.contains("rel")) {
            sno = (cno + value);
        }else {
            sno = value*1;
        }
        this.$modal.data("sno" , sno);
        this.$modal.find(".slide_pannel").css("left" , sno * -100 + "%");
        this.$modal.find(".pagination .btn1").removeClass("btn1").addClass("btn2");
        this.$modal.find(".pagination .numBtn").eq(sno).removeClass("btn2").addClass("btn1");
        this.$modal.find(".pagination .rel").removeAttr("disabled" , "disabled");

        if(sno - 1 < 0){
            this.$modal.find(".pagination .rel").eq(0).attr("disabled", "disabled");
        }else if(sno + 1 >= imgLen){
            this.$modal.find(".pagination .rel").eq(1).attr("disabled", "disabled");
        }
    }

    openFestivalModal = e => {
        let id = e.currentTarget.dataset.id;
        let data = this.datas.find(x => x.id == id);
        let htmlImgs = data.images.map(x => `<img src="${data.image_path}/${x}" class="img_cover" style="width : ${100 / data.images.length}%;" alt="No Image" >`);
        let htmlBtns = `<button class="btn0 btn2 rel" data-value="-1" disabled>&lt;</button>`;
        for (let i = 1; i <= data.images.length; i++) {
            htmlBtns += `<button class="btn0 ${i == 1 ? "btn1" : "btn2"} numBtn" data-value="${i - 1}">${i}</button>`;
        }
        htmlBtns += `<button class="btn0 btn2 rel" data-value="1">&gt;<button>`;
        this.$modal.data("sno", 0);
        $("#view_modal > .inner").empty();
        $("#view_modal > .inner").append(this.modalDOM(data));
        $("#view_modal > .inner .slide_pannel").append(htmlImgs.join(''));
        $("#view_modal > .inner .pagination").append(htmlBtns);
        $('#view_modal').dialog("open");

    }

    modalDOM(data) {
        return `
                       <div class="title">${data.nm}</div>
                    <div class="info">
                        <div class="img_box">
                            <img src="${data.image_path}/${data.images[0]}" alt="No Image">
                        </div>
                        <div class="text">
                            <table class="table">
                                <tr>
                                    <th width="30%">지역</th>
                                    <th width="70%">${data.area}</th>
                                </tr>
                                <tr>
                                    <th width="30%"  >장소</th>
                                    <th width="70%">${data.location}</th>
                                </tr>
                                <tr>
                                    <th width="30%"  >기간</th>
                                    <th width="70%">${data.dt}</th>
                                </tr>
                            </table>
                            <p class="cn">
                                ${data.cn}
                            </p>
                        </div>
                    </div>
                    <div class="slide">
                        <div class="slide_pannel" style="width: ${100 * data.images.length}%;">
                        </div>
                    </div>
                    <div class="pagination flex_c">
                        
                    </div>
        `

    }

    drawAlbum(viewList) {
        let main_festival = this.datas[this.datas.length - 1];
        let viewItems = viewList.map(item => this.makeAlbumItem(item));
        this.$content.html(this.makeAlbumDom(main_festival, viewItems))
    }

    drawList(viewList) {
        let viewItems = viewList.map(item => this.makeListItem(item));
        this.$content.html(this.makeListDom(viewItems))
    }


    makeListItem(item) {
        return ` <tr data-id="${item.id}" data-toggle="modal" data-target=".view_modal">
                           <td  style="text-align: center;">${item.no}</td>
                           <td  style="text-align: center;">${item.nm}</td>
                           <td  style="text-align: center;">${item.dt}</td>
                           <td  style="text-align: center;">${item.area}</td>
                  </tr>`
    }

    makeListDom(viewItems) {
        return `<div class="list">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style=" text-align: center; width: 5%;">번호</th>
                                <th style=" text-align: center; width: 60%;">제목</th>
                                <th style=" text-align: center; width: 10%;">기간</th>
                                <th style=" text-align: center; width: 15%;">장소</th>
                            </tr>
                        </thead>
                        <tbody>
                           ${viewItems.join('')}
                        </tbody>
                    </table>
                </div>`
    }

    makeAlbumItem(item) {
        return `<div class="card" data-id="${item.id}" data-toggle="modal" data-target=".view_modal">
                        <img src="/getImage?folder=${item.c_image}&img=${item.images[0]}" alt="No Image" title='No Image'>
                        <div class="text">
                            <div class="title">
                                ${item.nm}
                            </div>
                            <span>${item.dt}</span>
                        </div>
                        <div class="cnt flex_c">
                            ${item.images.length == 0 ? "" : item.images.length}
                        </div>
                    </div>`
    }

    makeAlbumDom(main_festival, viewItems) {
        return `<div class="album">
                <div class="main_festival" data-id="${main_festival.id}" data-toggle="modal" data-target=".view_modal">
                    <img src="${main_festival.image_path}/${main_festival.images[0]}" alt="No Image" class="img_cover" title="No Image">
                    <div class="text">
                        <div class="title">
                            ${main_festival.nm}
                        </div>
                        <p>${main_festival.cn}</p>
                        <span>${main_festival.dt}</span>
                        <div class="btn_group">
                            <button class="btn0 btn2">
                                자세히 보기
                            </button>
                        </div>
                    </div>
                </div>
                <div class="festivalList">
                        ${viewItems.join('')}
                </div>
               
            </div>`
    }

    getQueryString() {
        return location.search.substr(1).split("&").reduce((obj, item) => {
            let [key, value] = item.split("=");
            obj[key] = value;
            return obj;
        }, {});

    }


}
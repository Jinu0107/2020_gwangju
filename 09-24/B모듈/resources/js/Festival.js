window.addEventListener('load', () => {
    window.festival = new Festival();
});

const log = console.log
class Festival {
    constructor() {
        this.xml;
        this.datas;
        this.$btns = $(".j_festival .page_btn_group");
        this.$content = $('.j_festival .content');
        this.init();
    }

    async init() {
        this.xml = await this.getXML();
        this.datas = this.getDatas();
        log(this.datas);

        $("#view_modal").dialog({
            'width': 800,
            'my': 'center',
            'at': 'center',
            'show': true,
            'hidden': true,
            'modal': true,
            "autoOpen": true,
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
                image_path: `/xml/festivalImages/${item.querySelector("sn").innerHTML.padStart(3, "0")}_${item.querySelector("no").innerHTML}`
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
    }

    openFestivalModal = e => {
        let id = e.currentTarget.dataset.id;
        let festival = this.datas.find(x => x.id == id);
        log(festival);
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
                        <img src="${item.image_path}/${item.images[0]}" alt="No Image" title='No Image'>
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
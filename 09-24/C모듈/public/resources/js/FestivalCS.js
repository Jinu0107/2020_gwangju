



class FestivalCS {
    constructor() {
        this.datas = datas;
        this.$btns = $(".pagination_group");
        this.$tbody = $(".festivalCS .table tbody");
        this.render();
    }

    render() {
        let qs = this.getQueryString();

        let page = qs.page * 1;
        let type = qs.searchType;

        page = isNaN(page) || !page || page < 1 ? 1 : page;



        const ITEM_COUNT = 11;
        const BTN_COUNT = 8;


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

        this.drawItem(viewList);
    }


    drawItem(viewList) {
        viewList.forEach(item => {
            this.$tbody.append(this.makeDom(item));
        });
    }


    makeDom(item) {
        return `
                <tr>
                    <td><a href="/update?idx=${item.idx}" class="black_a">${item.idx}</a></td>
                    <td>
                        <a href="/festivalView?idx=${item.idx}" class="black_a">
                            ${item.name} <span class="tag">${item.cnt}</span>
                        </a>
                    </td>
                    <td>
                        <a href="/down?type=tar&idx=${item.idx}" class="btn0 btn1" style="color: #fff;">tar</a> 
                        <a href="/down?type=zip&idx=${item.idx}" class="btn0 btn1" style="color: #fff;">zip</a>
                    </td>
                    <td>${item.date}</td>
                    <td><span class="tag">${item.area}</span></td>
                </tr>
        `
    }



    getQueryString() {
        return location.search.substr(1).split("&").reduce((obj, item) => {
            let [key, value] = item.split("=");
            obj[key] = value;
            return obj;
        }, {});

    }
}

new FestivalCS();
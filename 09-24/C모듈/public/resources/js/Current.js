
window.addEventListener("load", () => {
    window.currnet = new Currnet();
});


class Currnet {
    constructor() {
        this.init();
        this.data;
        this.$tbody = $(".current table tbody");
        this.items;
    }

    async init() {
        this.data = await this.getData();
        this.items = this.data.items;

        if (this.data.statusCd != "200") {
            alert(this.data.statusMsg);
            return;
        }

        this.drawItem(this.items.splice(0, 10));

        if (localStorage.more) {
            this.drawItem(this.items.splice(0, this.items.length));
        }

        if (localStorage.scrollY) {
            $(window).scrollTop(localStorage.scrollY);
        }



        this.addEvent();

    }


    addEvent() {
        $(document).on("click", ".current .btn_group button", () => {
            this.drawItem(this.items.splice(0, this.items.length));
            localStorage.more = true;
        });

        $(window).on("scroll", (e) => {
            const CURRENT = $(window).scrollTop() + $(window).height();
            const BOTTOM = $('html').height();
            if (CURRENT >= BOTTOM) {
                this.drawItem(this.items.splice(0, this.items.length));
                localStorage.more = true;
            }

            localStorage.scrollY = $(window).scrollTop();
        });

    }

    drawItem(items) {
        items.forEach(item => {
            const DOM = `
                    <tr class="${item.result == 0 ? "active" : ""}">
                        <td>${item.result}</td>
                        <td>${item.cur_unit}</td>
                        <td>${item.ttb}</td>
                        <td>${item.tts}</td>
                        <td>${item.deal_bas_r}</td>
                        <td>${item.bkpr}</td>
                        <td>${item.yy_efee_r}</td>
                        <td>${item.ten_dd_efee_r}</td>
                        <td>${item.kftc_bkpr}</td>
                        <td>${item.kftc_deal_bas_r}</td>
                        <td>${item.cur_nm}</td>
                    </tr>
            `
            this.$tbody.append(DOM);
        });
    }


    getData() {
        return $.ajax("/restAPI/currentExchangeRate.php");
    }


}
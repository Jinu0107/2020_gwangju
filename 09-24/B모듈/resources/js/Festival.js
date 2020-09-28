window.addEventListener('load', () => {
    window.festival = new Festival();
});

const log = console.log
class Festival {
    constructor() {
        this.xml;
        this.datas;

        this.init();
    }

    async init() {
        this.xml = await this.getXML();
        this.datas = this.getDatas();
        this.addEvent();
    }

    addEvent() {
        document.querySelector
    }

    getXML() {
        return $.ajax('/xml/festivalList.xml');
    }

    getDatas() {
        const DATAS = [];
        this.xml.querySelectorAll("item").forEach(item => {
            const obj = {
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
            DATAS.push(obj);
        });
        return DATAS;
    }



}
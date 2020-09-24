const log = console.log;
window.addEventListener("load", () => {
    let app = new App();
});



class App {
    constructor() {
        this.festivalList;
        this.loadXML();
    }

    init() {
        log(this.festivalList);
    }


    getDatas(xml) {

    }



    loadXML() {
        $.ajax({
            url: '/xml/festivalList.xml',
            type: "get",
            success: (xml) => {
                const DATAS = [];
                xml.querySelectorAll("item").forEach((item, idx) => {
                    const OBJ = {
                        id: item.querySelector("sn").innerHTML,
                        no: item.querySelector("no").innerHTML,
                        nm: item.querySelector("nm").innerHTML,
                        area: item.querySelector("area").innerHTML,
                        location: item.querySelector("location").innerHTML,
                        dt: item.querySelector("dt").innerHTML,
                        cn: item.querySelector("cn").innerHTML,
                        images: Array.from(item.querySelectorAll("image")).map(x => x.innerHTML),
                        imgPath: `/xml/festivalImages/${item.querySelector("sn").innerHTML.padStart(3, '0')}_${item.querySelector("no").innerHTML}/`
                    };

                    DATAS.push(OBJ);
                });
                this.festivalList = DATAS;
                this.init();
            }
        });
    }
}
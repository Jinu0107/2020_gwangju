const log = console.log;

window.addEventListener("load", () => {
    $("#location_modal").dialog({
        'my':'center',
        'at':'center',
        'autoOpen':false,
        'modal': true,
        'show': true,
        'hide': true
    });


    $("header .location").on("click", (e) => {
        $.ajax({
            'url': "/location.php",
            'timeout': 1000,
            success: (r) => {
                $("#location_modal .inner").html(r);
                $("#location_modal").dialog("open");
            },
            error: (r) => {
                alert("찾아오시는 길을 표시할 수 없습니다.");
            }
        })
    });
});
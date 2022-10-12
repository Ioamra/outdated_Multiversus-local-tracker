var userLang = navigator.language || navigator.userLanguage;
userLang = userLang.slice(0, 2);

$(function () {
    getTextNavByLang(userLang);
});

function viewsSearchResult(data) {
    console.log(data);
    let res = "";
    for (let i = 0; i < data.result.length; i++) {
        res +=
            '<div class="col card text-center" style="width: fit-content;"><a style="text-decoration: none;" href="account.html?name=' +
            data.result[i].username + '"><img style="height:8em; width:8em;" class="mx-auto" src="/img/profil/' +
            data.result[i].avatar + '.jpg"/><p class="mb-0 txt-normal text-dark">' +
            data.result[i].username + '</p><p class="mb-0 txt-normal grey">lvl ' +
            data.result[i].level + "</p></a></div>";
    }
    $("#search-result").html(res);
    $("#search-box").attr("style", "display:block;");
}

function handleKeyPress(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        window.location.href = "account.html?name=" + $("#usernameInput").val();
    }
}

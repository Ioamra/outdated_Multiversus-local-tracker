const urlParams = new URLSearchParams(window.location.search);
const GETcharacter = urlParams.get("character");
var userLang = navigator.language || navigator.userLanguage;
userLang = userLang.slice(0, 2);
var page = 1;
if (urlParams.get("page")) {
    page = urlParams.get("page");
}

$(function () {
    getTextNavByLang(userLang);
    getTextLeaderboardByLang(userLang);

    if (GETcharacter) {
        getDataLeaderboardCharacter(GETcharacter);
    } else {
        getDataLeaderboard();
    }
});

function getDataLeaderboard() {
    fetch("mvsstatleaderboard?page=" + page)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                $("#loader").css("display", "none");
                console.log(data);
                veiwsCharacterList(data.charactersList);
                veiwsLeaderboard(data);
                viewsPagin();
            }
        });
}

function getDataLeaderboardCharacter(character) {
    fetch("mvsstatleaderboard?character=" + character + "&page=" + page)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                $("#loader").css("display", "none");
                console.log(data);
                veiwsCharacterList(data.charactersList);
                veiwsLeaderboardCharacter(data);
                $("title").html("Multiversus - Leaderboard - " + data.character);
                viewsPagin();
            }
        });
}

function veiwsCharacterList(charactersList) {
    let htmlCharactersList = "";
    for (let i = 0; i < charactersList.length; i++) {
        htmlCharactersList +=
            '<div class="col m-1"><a href="leaderboard.html?character=' + charactersList[i].fullName +
            '"><img style="height:5em; width:auto;" src="/img/perso/' + charactersList[i].name + '.jpg" /></a></div>';
    }
    $("#charactersList").html(htmlCharactersList);
}

function veiwsLeaderboard(data) {
    let htmlLeaderboard1v1 =
        "<br>" +
        '<thead style="height:4em;" class="border-bottom border-white">' +
        "<tr>" +
        '<th class="json-txt-rank" style="min-width:5em;"></th>' +
        "<th></th>" +
        '<th class="json-txt-pseudo" style="min-width:13em;"></th>' +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th>MMR</th>" +
        '<th style="min-width:8em;">' +
        '<p class="m-0 json-txt-nbMatch"></p>' +
        '<p class="m-0 json-txt-win-lose"></p>' +
        "</th>" +
        "</tr>" +
        "</thead>" +
        '<tbody class="pt-2">';
    let htmlLeaderboard2v2 =
        "<br>" +
        '<thead style="height:4em;" class="border-bottom border-white">' +
        "<tr>" +
        '<th class="json-txt-rank" style="min-width:5em;"></th>' +
        "<th></th>" +
        '<th class="json-txt-pseudo" style="min-width:13em;"></th>' +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th>MMR</th>" +
        '<th style="min-width:8em;">' +
        '<p class="m-0 json-txt-nbMatch"></p>' +
        '<p class="m-0 json-txt-win-lose"></p>' +
        "</th>" +
        "</tr>" +
        "</thead>" +
        '<tbody class="pt-2">';

    for (let i = 0; i < 25; i++) {
        htmlLeaderboard1v1 += "<tr>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><p class="mb-0 vertical-align-middle">' +
            data.leaderboard1v1[i].rank + "</p></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:5em; width:auto;" src="/img/profil/' +
            data.leaderboard1v1[i].avatar + '.jpg"/></a></td>';
        htmlLeaderboard1v1 +=
            '<td><a class="d-inline-block text-light" style="line-height:5em; text-decoration:none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><p class="mb-0 vertical-align-middle">' +
            data.leaderboard1v1[i].name + "</p></a>";
        if (data.leaderboard1v1[i].nameTwitch) {
            htmlLeaderboard1v1 +=
                '<a href="https://www.twitch.tv/' + data.leaderboard1v1[i].nameTwitch +
                '"><img class="d-inline-block ms-2" style="height:1.5em; width:auto;" src="/img/icon-twitch.png" /></a>';
        }
        htmlLeaderboard1v1 += "</td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:5em; width:auto;" src="/img/perso/' +
            data.leaderboard1v1[i].topRatingCharacter + '.jpg"/></a></td>';
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:4em; width:auto; margin-left:5px;" ';
        if (data.leaderboard1v1[i].perks1) {
            htmlLeaderboard1v1 += 'src="/img/perks/' + data.leaderboard1v1[i].perks1 + '.png"';
        }
        htmlLeaderboard1v1 += "/></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard1v1[i].perks2) {
            htmlLeaderboard1v1 += 'src="/img/perks/' + data.leaderboard1v1[i].perks2 + '.png"';
        }

        htmlLeaderboard1v1 += "/></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard1v1[i].perks3) {
            htmlLeaderboard1v1 += 'src="/img/perks/' + data.leaderboard1v1[i].perks3 + '.png"';
        }

        htmlLeaderboard1v1 += "/></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard1v1[i].perks4) {
            htmlLeaderboard1v1 += 'src="/img/perks/' + data.leaderboard1v1[i].perks4 + '.png"';
        }

        htmlLeaderboard1v1 += "/></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><p class="mx-4 my-0 vertical-align-middle">' +
            data.leaderboard1v1[i].mmr + "</p></a></td>";
        htmlLeaderboard1v1 +=
            '<td class="text-center"><a class="d-block text-light" style="text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><div class="vertical-align-middle"><p class="m-0" style="line-height:2.5em;">' +
            data.leaderboard1v1[i].totalMatch + '</p><p class="m-0" style="line-height:2.5em;"><span class="green">' +
            data.leaderboard1v1[i].win + '</span> - <span class="red">' +
            data.leaderboard1v1[i].lose + "</span></p></div></a></td>";
        htmlLeaderboard1v1 += "</tr>";

        htmlLeaderboard2v2 += "<tr>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none; width:5em;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><p class="mb-0 vertical-align-middle">' +
            data.leaderboard2v2[i].rank + "</p></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:5em; width:auto;" src="/img/profil/' +
            data.leaderboard2v2[i].avatar + '.jpg"/></a></td>';
        htmlLeaderboard2v2 +=
            '<td><div style="width:13em;"><a class="d-inline-block text-light" style="line-height:5em; text-decoration:none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><p class="mb-0 vertical-align-middle">' +
            data.leaderboard2v2[i].name + "</p></a>";
        if (data.leaderboard2v2[i].nameTwitch) {
            htmlLeaderboard2v2 += '<a href="https://www.twitch.tv/' + data.leaderboard2v2[i].nameTwitch +
                '"><img class="d-inline-block ms-2" style="height:1.5em; width:auto;" src="/img/icon-twitch.png" /></a>';
        }
        htmlLeaderboard2v2 += "</div></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:5em; width:auto;" src="/img/perso/' +
            data.leaderboard2v2[i].topRatingCharacter + '.jpg"/></a></td>';
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:4em; width:auto; margin-left:5px;" ';
        if (data.leaderboard2v2[i].perks1) {
            htmlLeaderboard2v2 += 'src="/img/perks/' + data.leaderboard2v2[i].perks1 + '.png"';
        }

        htmlLeaderboard2v2 += "/></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard2v2[i].perks2) {
            htmlLeaderboard2v2 += 'src="/img/perks/' + data.leaderboard2v2[i].perks2 + '.png"';
        }

        htmlLeaderboard2v2 += "/></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard2v2[i].perks3) {
            htmlLeaderboard2v2 += 'src="/img/perks/' + data.leaderboard2v2[i].perks3 + '.png"';
        }

        htmlLeaderboard2v2 += "/></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard2v2[i].perks4) {
            htmlLeaderboard2v2 += 'src="/img/perks/' + data.leaderboard2v2[i].perks4 + '.png"';
        }

        htmlLeaderboard2v2 += "/></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><p class="mx-4 my-0 vertical-align-middle">' +
            data.leaderboard2v2[i].mmr + "</p></a></td>";
        htmlLeaderboard2v2 +=
            '<td class="text-center"><a class="d-block text-light" style="text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><div class="vertical-align-middle"><p class="m-0" style="line-height:2.5em;">' +
            data.leaderboard2v2[i].totalMatch + '</p><p class="m-0" style="line-height:2.5em;"><span class="green">' +
            data.leaderboard2v2[i].win + '</span> - <span class="red">' +
            data.leaderboard2v2[i].lose + "</span></p></div></a></td>";
        htmlLeaderboard2v2 += "</tr>";
    }

    htmlLeaderboard1v1 += "</tbody>";
    htmlLeaderboard2v2 += "</tbody>";
    $("#leaderboard1v1").html(htmlLeaderboard1v1);
    $("#leaderboard2v2").html(htmlLeaderboard2v2);
    getTextLeaderboardByLang(userLang);
}

function veiwsLeaderboardCharacter(data) {
    let htmlLeaderboard1v1 =
        "<br>" +
        '<thead style="height:4em;" class="border-bottom border-white">' +
        "<tr>" +
        '<th class="json-txt-rank" style="min-width:5em;"></th>' +
        "<th></th>" +
        '<th class="json-txt-pseudo" style="min-width:13em;"></th>' +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th>MMR</th>" +
        '<th class="json-txt-win"></th>' +
        "</tr>" +
        "</thead>" +
        '<tbody class="pt-2">';
    let htmlLeaderboard2v2 =
        "<br>" +
        '<thead style="height:4em;" class="border-bottom border-white">' +
        "<tr>" +
        '<th class="json-txt-rank" style="min-width:5em;"></th>' +
        "<th></th>" +
        '<th class="json-txt-pseudo" style="min-width:13em;"></th>' +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th></th>" +
        "<th>MMR</th>" +
        '<th class="json-txt-win"></th>' +
        "</tr>" +
        "</thead>" +
        '<tbody class="pt-2">';

    for (let i = 0; i < 25; i++) {
        htmlLeaderboard1v1 += "<tr>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none; width:5em;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><p class="mb-0 vertical-align-middle">' +
            data.leaderboard1v1[i].rank + "</p></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:5em; width:auto;" src="/img/profil/' +
            data.leaderboard1v1[i].avatar + '.jpg"/></a></td>';
        htmlLeaderboard1v1 +=
            '<td><div style="width:13em;"><a class="d-inline-block text-light" style="line-height:5em; text-decoration:none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><p class="mb-0 vertical-align-middle">' +
            data.leaderboard1v1[i].name + "</p></a>";
        if (data.leaderboard1v1[i].nameTwitch) {
            htmlLeaderboard1v1 += '<a href="https://www.twitch.tv/' + data.leaderboard1v1[i].nameTwitch +
                '"><img class="d-inline-block ms-2" style="height:1.5em; width:auto;" src="/img/icon-twitch.png" /></a>';
        }
        htmlLeaderboard1v1 += "</div></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:5em; width:auto;" src="/img/perso/' +
            data.character + '.jpg"/></a></td>';
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:4em; width:auto; margin-left:5px;" ';
        if (data.leaderboard1v1[i].perks1) {
            htmlLeaderboard1v1 += 'src="/img/perks/' + data.leaderboard1v1[i].perks1 + '.png"';
        }

        htmlLeaderboard1v1 += "/></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard1v1[i].perks2) {
            htmlLeaderboard1v1 += 'src="/img/perks/' + data.leaderboard1v1[i].perks2 + '.png"';
        }

        htmlLeaderboard1v1 += "/></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard1v1[i].perks3) {
            htmlLeaderboard1v1 += 'src="/img/perks/' + data.leaderboard1v1[i].perks3 + '.png"';
        }

        htmlLeaderboard1v1 += "/></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard1v1[i].perks4) {
            htmlLeaderboard1v1 += 'src="/img/perks/' + data.leaderboard1v1[i].perks4 + '.png"';
        }

        htmlLeaderboard1v1 += "/></a></td>";
        htmlLeaderboard1v1 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><p class="mx-4 my-0 vertical-align-middle">' +
            data.leaderboard1v1[i].mmr + "</p></a></td>";
        htmlLeaderboard1v1 +=
            '<td class="text-center"><a class="d-block text-light" style="text-decoration: none;" href="account.html?name=' +
            data.leaderboard1v1[i].name + '"><p class="m-0 green vertical-align-middle">' +
            data.leaderboard1v1[i].win + "</p></a></td>";
        htmlLeaderboard1v1 += "</tr>";

        htmlLeaderboard2v2 += "<tr>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none; width:5em;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><p class="mb-0 vertical-align-middle">' +
            data.leaderboard2v2[i].rank + "</p></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:5em; width:auto;" src="/img/profil/' +
            data.leaderboard2v2[i].avatar + '.jpg"/></a></td>';
        htmlLeaderboard2v2 +=
            '<td><div style="width:13em;"><a class="d-inline-block text-light" style="line-height:5em; text-decoration:none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><p class="mb-0 vertical-align-middle">' +
            data.leaderboard2v2[i].name + "</p></a>";
        if (data.leaderboard2v2[i].nameTwitch) {
            htmlLeaderboard2v2 += '<a href="https://www.twitch.tv/' + data.leaderboard2v2[i].nameTwitch +
                '"><img class="d-inline-block ms-2" style="height:1.5em; width:auto;" src="/img/icon-twitch.png" /></a>';
        }
        htmlLeaderboard2v2 += "</div></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:5em; width:auto;" src="/img/perso/' +
            data.character + '.jpg"/></a></td>';
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:4em; width:auto; margin-left:5px;" ';
        if (data.leaderboard2v2[i].perks1) {
            htmlLeaderboard2v2 += 'src="/img/perks/' + data.leaderboard2v2[i].perks1 + '.png"';
        }

        htmlLeaderboard2v2 += "/></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard2v2[i].perks2) {
            htmlLeaderboard2v2 += 'src="/img/perks/' + data.leaderboard2v2[i].perks2 + '.png"';
        }

        htmlLeaderboard2v2 += "/></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard2v2[i].perks3) {
            htmlLeaderboard2v2 += 'src="/img/perks/' + data.leaderboard2v2[i].perks3 + '.png"';
        }

        htmlLeaderboard2v2 += "/></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><img style="height:3em; width:auto;" ';
        if (data.leaderboard2v2[i].perks4) {
            htmlLeaderboard2v2 += 'src="/img/perks/' + data.leaderboard2v2[i].perks4 + '.png"';
        }

        htmlLeaderboard2v2 += "/></a></td>";
        htmlLeaderboard2v2 +=
            '<td><a class="d-block text-light" style="line-height:5em; text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><p class="mx-4 my-0 vertical-align-middle">' +
            data.leaderboard2v2[i].mmr + "</p></a></td>";
        htmlLeaderboard2v2 +=
            '<td class="text-center"><a class="d-block text-light" style="text-decoration: none;" href="account.html?name=' +
            data.leaderboard2v2[i].name + '"><p class="m-0 green vertical-align-middle">' +
            data.leaderboard2v2[i].win + "</p></a></td>";
        htmlLeaderboard2v2 += "</tr>";
    }

    htmlLeaderboard1v1 += "</tbody>";
    htmlLeaderboard2v2 += "</tbody>";
    $("#leaderboard1v1").html(htmlLeaderboard1v1);
    $("#leaderboard2v2").html(htmlLeaderboard2v2);
    getTextLeaderboardByLang(userLang);
}

function viewsPagin() {
    var htmlPagin = "";
    if (page < 6) {
        htmlPagin += '<a href="';
        if (page != 1) {
            htmlPagin += "leaderboard.html?";
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += "page=" + (Number(page) - 1);
        }
        htmlPagin += '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin ';
        if (page == 1) {
            htmlPagin += 'text-secondary"';
        } else {
            htmlPagin += 'text-light"';
        }
        htmlPagin += '>&lt;</button></a><a href="';
        if (page != 1) {
            htmlPagin += "leaderboard.html?";
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += "page=1";
        }
        htmlPagin += '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin ';
        if (page == 1) {
            htmlPagin += 'text-secondary"';
        } else {
            htmlPagin += 'text-light" href="leaderboard.html?';
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += 'page=1"';
        }
        htmlPagin += '>1</button></a><a href="';
        if (page != 2) {
            htmlPagin += "leaderboard.html?";
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += "page=2";
        }
        htmlPagin += '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin ';
        if (page == 2) {
            htmlPagin += 'text-secondary"';
        } else {
            htmlPagin += 'text-light" href="leaderboard.html?';
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += 'page=2"';
        }
        htmlPagin += '>2</button></a><a href="';
        if (page != 3) {
            htmlPagin += "leaderboard.html?";
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += "page=3";
        }
        htmlPagin += '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin ';
        if (page == 3) {
            htmlPagin += 'text-secondary"';
        } else {
            htmlPagin += 'text-light" href="leaderboard.html?';
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += 'page=3"';
        }
        htmlPagin += '>3</button></a><a href="';
        if (page != 4) {
            htmlPagin += "leaderboard.html?";
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += "page=4";
        }
        htmlPagin += '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin ';
        if (page == 4) {
            htmlPagin += 'text-secondary"';
        } else {
            htmlPagin += 'text-light" href="leaderboard.html?';
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += 'page=4"';
        }
        htmlPagin += '>4</button></a><a href="';
        if (page != 5) {
            htmlPagin += "leaderboard.html?";
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += "page=5";
        }
        htmlPagin += '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin ';
        if (page == 5) {
            htmlPagin += 'text-secondary"';
        } else {
            htmlPagin += 'text-light" href="leaderboard.html?';
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += 'page=5"';
        }
        htmlPagin += '>5</button></a><a href="';
        if (page != 6) {
            htmlPagin += "leaderboard.html?";
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += "page=6";
        }
        htmlPagin += '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin ';
        if (page == 6) {
            htmlPagin += 'text-secondary"';
        } else {
            htmlPagin += 'text-light" href="leaderboard.html?';
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += 'page=6"';
        }
        htmlPagin += '>6</button></a><a href="';
        if (page != 7) {
            htmlPagin += "leaderboard.html?";
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += "page=7";
        }
        htmlPagin += '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin ';
        if (page == 7) {
            htmlPagin += 'text-secondary"';
        } else {
            htmlPagin += 'text-light" href="leaderboard.html?';
            if (GETcharacter) {
                htmlPagin += "character=" + GETcharacter + "&";
            }
            htmlPagin += 'page=7"';
        }
        htmlPagin += '>7</button><a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += "page=" + (Number(page) + 1) + '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-light">&gt;</button></a>';
    } else {
        htmlPagin += '<a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += "page=" + (Number(page) - 1) + '"><button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-light">&lt;</button>';
        htmlPagin += "</a>";
        htmlPagin += '<a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += 'page=1">';
        htmlPagin += '<button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-light">1</button>';
        htmlPagin += "</a>";
        htmlPagin += '<button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-secondary">...</button>';
        htmlPagin += '<a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += "page=" + (Number(page) - 2) + '">';
        htmlPagin += '<button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-light">' + (Number(page) - 2) + "</button>";
        htmlPagin += "</a>";
        htmlPagin += '<a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += "page=" + (Number(page) - 1) + '">';
        htmlPagin += '<button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-light">' + (Number(page) - 1) + "</button>";
        htmlPagin += "</a>";
        htmlPagin += '<a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += "page=" + Number(page) + '">';
        htmlPagin += '<button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-secondary">' + Number(page) + "</button>";
        htmlPagin += "</a>";
        htmlPagin += '<a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += "page=" + (Number(page) + 1) + '">';
        htmlPagin += '<button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-light">' + (Number(page) + 1) + "</button>";
        htmlPagin += "</a>";
        htmlPagin += '<a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += "page=" + (Number(page) + 2) + '">';
        htmlPagin += '<button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-light">' + (Number(page) + 2) + "</button>";
        htmlPagin += "</a>";
        htmlPagin += '<a href="leaderboard.html?';
        if (GETcharacter) {
            htmlPagin += "character=" + GETcharacter + "&";
        }
        htmlPagin += "page=" + (Number(page) + 1) + '">';
        htmlPagin += '<button class="btn btn-outline-secondary mx-1 ratio-btn-pagin text-light">&gt;</button>';
        htmlPagin += "</a>";
    }
    $("#pagin").html(htmlPagin);
}

function viewsSearchResult(data) {
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

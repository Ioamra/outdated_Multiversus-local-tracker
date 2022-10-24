const urlParams = new URLSearchParams(window.location.search);
const GETname = urlParams.get("name");
var userLang = navigator.language || navigator.userLanguage;
userLang = userLang.slice(0, 2);
var charactersHisto = [];

$(function () {
    $("title").html("Multiversus - Account - " + GETname);
    getTextNavByLang(userLang);
    getTextAccountByLang(userLang);

    $("#btnMoreMatchs").on("click", function () {
        window.location.href = "matchs.html?name=" + GETname;
    });
    getDataByName(GETname);
    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        this.addEventListener("hide.bs.tooltip", function () {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

function getDataByName(name) {
    $("#loader").css("display", "block");
    fetch("mvsstataccount?name=" + name)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data);
                viewsInfoAccount(data);
                if (data.matches[Object.keys(data.matches)[0]]) {
                    veiwsInfoMatchs(data.matches);
                }
                var tooltipTriggerList = [].slice.call(
                    document.querySelectorAll('[data-bs-toggle="tooltip"]')
                );
                var tooltipList = tooltipTriggerList.map(function (
                    tooltipTriggerEl
                ) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            }
        });
}

//* module datatable for sorting
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "formatted-num-pre": function (a) {
        a = a === "-" || a === "" ? 0 : a.replace(/[^\d\-\.]/g, "");
        return parseFloat(a);
    },

    "formatted-num-asc": function (a, b) {
        return a - b;
    },

    "formatted-num-desc": function (a, b) {
        return b - a;
    },
});

async function viewsInfoAccount(data) {
    yearCrea = data.globals.created_at.slice(0, 4);
    monthCrea = data.globals.created_at.slice(5, 7);
    dayCrea = data.globals.created_at.slice(8, 10);
    if (userLang == "en") {
        $("#dateCrea").text(monthCrea + "/" + dayCrea + "/" + yearCrea);
    } else if (userLang == "fr") {
        $("#dateCrea").text(dayCrea + "/" + monthCrea + "/" + yearCrea);
    } else {
        $("#dateCrea").text(monthCrea + "/" + dayCrea + "/" + yearCrea);
    }

    $("#avatar").html('<img id="img-profil" src="/img/profil/' + data.globals.avatar + '.jpg">');
    if (data.matches[Object.keys(data.matches)[0]]) {
        if (data.matches[Object.keys(data.matches)[0]].me) {
            $("#card-account").css("background-image", "url(/img/perso/" + data.matches[Object.keys(data.matches)[0]].me.character + "-lg.png)");
        }
    }
    $("#username").html(data.globals.username);
    if (data.globals.nameTwitch) {
        $("#username").html(data.globals.username +
            '<a href="https://www.twitch.tv/' + data.globals.nameTwitch +
            '"><img class="d-inline-block ms-2" style="height:1em; width:auto;" src="/img/icon-twitch.png" /></a>');
    }
    $("#level").text(data.globals.level);
    $("#totalMatch").text(numberWithSpaces(data.globals.totalMatch));
    $("#percentageWin").text(Math.round(data.globals.percentageWin * 1000) / 1000 + " %");
    $("#win").text(numberWithSpaces(data.globals.win));
    $("#lose").text(numberWithSpaces(data.globals.lose));
    $("#assists").text(numberWithSpaces(data.globals.totalAssists));
    $("#attackDodged").text(numberWithSpaces(data.globals.totalAttacksDodged));
    $("#damageDone").text(numberWithSpaces(data.globals.lifetimeDamage));
    $("#doubleRingOuts").text(numberWithSpaces(data.globals.totalDoubleRingouts));
    $("#ringOutLeader").text(numberWithSpaces(data.globals.totalRingoutLeader));
    $("#ringOuts").text(numberWithSpaces(data.globals.totalRingouts));
    $("#totalMaxedCharacters").text(data.globals.totalMaxedCharacters);
    $("#highestDamageDealt").text(numberWithSpaces(data.globals.highestDamageDealt));

    if (data.stat1v1) {
        $("#totalMatch1").text(numberWithSpaces(data.stat1v1.totalMatch));
        $("#percentageWin1").text(Math.round(data.stat1v1.percentageWin * 1000) / 1000 + " %");
        $("#win1").text(numberWithSpaces(data.stat1v1.win));
        $("#lose1").text(numberWithSpaces(data.stat1v1.lose));
        $("#rank1").text(numberWithSpaces(data.stat1v1.rank));
        $("#totalPlayers1").text(numberWithSpaces(data.stat1v1.totalPlayers));
        $("#score1").text(numberWithSpaces(Math.round(data.stat1v1.score * 100) / 100));
        $("#top1").text("(top " + numberWithSpaces(Math.round(data.stat1v1.top * 10000000) / 10000000) + " % )");
        $("#longestWinStreak1").text(data.stat1v1.longestWinStreak);
        $("#winStreak1").text(data.stat1v1.winStreak);

        let imgCard1v1 = "/img/perso/" + data.stat1v1.topRatingCharacter + "-lg.png";
        $("#card1v1").css("background-image", "url(" + imgCard1v1 + ")");
    }

    if (data.stat2v2) {
        $("#totalMatch2").text(numberWithSpaces(data.stat2v2.totalMatch));
        $("#percentageWin2").text(Math.round(data.stat2v2.percentageWin * 1000) / 1000 + " %");
        $("#win2").text(numberWithSpaces(data.stat2v2.win));
        $("#lose2").text(numberWithSpaces(data.stat2v2.lose));
        $("#rank2").text(numberWithSpaces(data.stat2v2.rank));
        $("#totalPlayers2").text(numberWithSpaces(data.stat2v2.totalPlayers));
        $("#score2").text(numberWithSpaces(Math.round(data.stat2v2.score * 100) / 100));
        $("#top2").text("(top " + numberWithSpaces(Math.round(data.stat2v2.top * 10000000) / 10000000) + " % )");
        $("#longestWinStreak2").text(data.stat2v2.longestWinStreak);
        $("#winStreak2").text(data.stat2v2.winStreak);

        let imgCard2v2 = "/img/perso/" + data.stat2v2.topRatingCharacter + "-lg.png";
        $("#card2v2").css("background-image", "url(" + imgCard2v2 + ")");
    }

    Chart.pluginService.register({
        beforeDraw: function (chart) {
            var width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;
            ctx.restore();
            var fontSize = (height / 100).toFixed(2);
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "white";
            var text = chart.config.options.elements.center.text,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 1.85;
            ctx.fillText(text, textX, textY);
            ctx.save();
        },
    });

    const ctxCercleStat1 = document.getElementById("cercleStat1").getContext("2d");
    const cercleStat1 = new Chart(ctxCercleStat1, {
        type: "doughnut",
        labels: ["Victoires", "Défaites"],
        data: {
            datasets: [{
                data: [data.globals.percentageWin, 100 - data.globals.percentageWin],
                backgroundColor: ["rgb(113, 212, 0)", "rgb(214, 11, 11)"],
                borderColor: ["black", "black"],
            }],
        },
        options: {
            tooltips: { enabled: false },
            hover: { mode: null },
            cutoutPercentage: 80,
            elements: {
                center: {
                    text: Math.round(data.globals.percentageWin * 100) / 100 + " %",
                },
            },
        },
    });

    if (data.stat1v1) {
        const ctxCercleStat2 = document.getElementById("cercleStat2").getContext("2d");
        const cercleStat2 = new Chart(ctxCercleStat2, {
            type: "doughnut",
            labels: ["Victoires", "Défaites"],
            data: {
                datasets: [{
                    data: [data.stat1v1.percentageWin, 100 - data.stat1v1.percentageWin],
                    backgroundColor: ["rgb(113, 212, 0)", "rgb(214, 11, 11)"],
                    borderColor: ["black", "black"],
                }],
            },
            options: {
                tooltips: { enabled: false },
                hover: { mode: null },
                cutoutPercentage: 80,
                elements: {
                    center: {
                        text: Math.round(data.stat1v1.percentageWin * 100) / 100 + " %",
                    },
                },
            },
        });
    }

    if (data.stat2v2) {
        const ctxCercleStat3 = document.getElementById("cercleStat3").getContext("2d");
        const cercleStat3 = new Chart(ctxCercleStat3, {
            type: "doughnut",
            labels: ["Victoires", "Défaites"],

            data: {
                datasets: [{
                    data: [data.stat2v2.percentageWin, 100 - data.stat2v2.percentageWin],
                    backgroundColor: ["rgb(113, 212, 0)", "rgb(214, 11, 11)"],
                    borderColor: ["black", "black"],
                }],
            },
            options: {
                tooltips: { enabled: false },
                hover: { mode: null },
                cutoutPercentage: 80,
                elements: {
                    center: {
                        text: Math.round(data.stat2v2.percentageWin * 100) / 100 + " %",
                    },
                },
            },
        });
    }

    var dataCharacters = [];
    for (let i = 0; i < Object.keys(data.charactersPlayed).length; i++) {
        dataCharacters.push(data.charactersPlayed[i]);
    }

    $("#datatable").DataTable({
        destroy: true,
        data: dataCharacters,
        pageLength: 30,
        order: [[10, "desc"], [13, "desc"]],
        columnDefs: [
            { type: null, sorting: false, targets: 0 },
            { type: "string", targets: 1 },
            { type: "num", targets: 2 },
            { type: "num", targets: 3 },
            { type: "num", targets: 4 },
            { type: null, sorting: false, targets: 5 },
            { type: null, sorting: false, targets: 6 },
            { type: null, sorting: false, targets: 7 },
            { type: null, sorting: false, targets: 8 },
            { type: "formatted-num", targets: 9 },
            { type: "formatted-num", targets: 10 },
            { type: "formatted-num", targets: 11 },
            { type: "formatted-num", targets: 12 },
            { type: "formatted-num", targets: 13 },
            { type: "formatted-num", targets: 14 },
        ],
        columns: [
            {
                data: "img",
                render: (data, type, row, meta) => {
                    return '<img style="height:5em; width:auto;" src="/img/perso/' + row.name + '.jpg" /></a>';
                },
            },
            {
                data: "combatants",
                render: (data, type, row, meta) => {
                    return row.name.replace("_", " ").replace("_", " ");
                },
            },
            {
                data: "niveau",
                render: (data, type, row, meta) => {
                    return row.level;
                },
            },
            {
                data: "streak",
                render: (data, type, row, meta) => {
                    if (row.streak == undefined) {
                        return '<div style="color:black;">-999 999</div>';
                    } else {
                        return row.streak;
                    }
                },
            },
            {
                data: "victoires",
                render: (data, type, row, meta) => {
                    return row.win;
                },
            },
            {
                data: "perks1",
                render: (data, type, row, meta) => {
                    if (row.perks1 != "") {
                        return '<img style="height:5em; width:auto;" src="/img/perks/' + row.perks1 + '.png" /></a>';
                    } else {
                        return '<div class="noPerks" style="height:5em; width:auto;"></div>';
                    }
                },
            },
            {
                data: "perks2",
                render: (data, type, row, meta) => {
                    if (row.perks2 != "") {
                        return '<img style="height:3em; width:auto;" src="/img/perks/' + row.perks2 + '.png" /></a>';
                    } else {
                        return '<div class="noPerks" style="height:5em; width:auto;"></div>';
                    }
                },
            },
            {
                data: "perks3",
                render: (data, type, row, meta) => {
                    if (row.perks3 != "") {
                        return '<img style="height:3em; width:auto;" src="/img/perks/' + row.perks3 + '.png" /></a>';
                    } else {
                        return '<div class="noPerks" style="height:5em; width:auto;"></div>';
                    }
                },
            },
            {
                data: "perks4",
                render: (data, type, row, meta) => {
                    if (row.perks4 != "") {
                        return '<img style="height:3em; width:auto;" src="/img/perks/' + row.perks4 + '.png" /></a>';
                    } else {
                        return '<div class="noPerks" style="height:5em; width:auto;"></div>';
                    }
                },
            },
            {
                data: "1v1Rank",
                render: (data, type, row, meta) => {
                    if (row.rank1v1 == 0 || row.rank1v1 == null) {
                        return '<div style="color:black;">9 999 999</div>';
                    } else {
                        return numberWithSpaces(Number(row.rank1v1));
                    }
                },
            },
            {
                data: "1v1MMR",
                render: (data, type, row, meta) => {
                    if (row.score1v1 == 0 || row.score1v1 == null) {
                        return '<div style="color:black;">0</div>';
                    } else {
                        return '<div class="red">' + numberWithSpaces(Math.round(Number(row.score1v1) * 100) / 100) + "</div>";
                    }
                },
            },
            {
                data: "1v1Top",
                render: (data, type, row, meta) => {
                    if (row.top1v1 == 0 || row.top1v1 == null) {
                        return '<div style="color:black;">0</div>';
                    } else {
                        return '<div class="orange">' + numberWithSpaces(Math.round(Number(row.top1v1) * 10000) / 10000) + " %</div>";
                    }
                },
            },
            {
                data: "2v2Rank",
                render: (data, type, row, meta) => {
                    if (row.rank2v2 == 0 || row.rank2v2 == null) {
                        return '<div style="color:black;">9 999 999</div>';
                    } else {
                        return numberWithSpaces(Number(row.rank2v2));
                    }
                },
            },
            {
                data: "2v2MMR",
                render: (data, type, row, meta) => {
                    if (row.score2v2 == 0 || row.score2v2 == null) {
                        return '<div style="color:black;">0</div>';
                    } else {
                        return '<div class="red">' + numberWithSpaces(Math.round(Number(row.score2v2) * 100) / 100) + "</div>";
                    }
                },
            },
            {
                data: "2v2Top",
                render: (data, type, row, meta) => {
                    if (row.top2v2 == 0 || row.top2v2 == null) {
                        return '<div style="color:black;">0</div>';
                    } else {
                        return '<div class="orange">' + numberWithSpaces(Math.round(Number(row.top2v2) * 10000) / 10000) + " %</div>";
                    }
                },
            },
        ],
        initComplete: function () {
            $("#loader").css("display", "none");
            $("#datatable td img").parents("td").addClass("p-img-datatable");
            $("#datatable td .noPerks").parents("td").addClass("p-img-datatable");
            $("#datatable").attr("style", "width: auto;");
        },
    });
}

function veiwsInfoMatchs(data) {
    let dataGames = "";
    for (let i = 0; i < 25; i++) {
        if (data[i]) {
            let date = new Date().toISOString();
            let yearActu = Number(date.slice(0, 4));
            let monthActu = Number(date.slice(5, 7));
            let dayActu = Number(date.slice(8, 10));
            let hoursActu = Number(date.slice(11, 13));
            let minutesActu = Number(date.slice(14, 16));
            let dateActu = new Date(yearActu, monthActu, dayActu, hoursActu, minutesActu);

            let yearGame = Number(data[i].completion_time.slice(0, 4));
            let monthGame = Number(data[i].completion_time.slice(5, 7));
            let dayGame = Number(data[i].completion_time.slice(8, 10));
            let hoursGame = Number(data[i].completion_time.slice(11, 13));
            let minutesGame = Number(data[i].completion_time.slice(14, 16));
            let dateGame = new Date(yearGame, monthGame, dayGame, hoursGame, minutesGame);
            dataDate = getTimeBetween(dateGame, dateActu, userLang);
            dataGames += createLine(data[i]);
            if (data[i].mode == "1v1" || data[i].mode == "2v2") {
                if (charactersHisto.find(o => o.character == data[i].me.character)) {
                    if (data[i].mode == "1v1") {
                        charactersHisto.find((x, y) => {
                            if (x.character ==  data[i].me.character) {
                                if (data[i].me.postMmr) {
                                    charactersHisto[y].mmrDiff1 = x.mmrDiff1 + Math.round((data[i].me.postMmr - data[i].me.preMmr) * 100) / 100;
                                }
                            };
                        });
                    }
                    if (data[i].mode == "2v2") {
                        charactersHisto.find((x, y) => {
                            if (x.character ==  data[i].me.character) {
                                if (data[i].me.postMmr) {
                                    charactersHisto[y].mmrDiff2 = x.mmrDiff2 + Math.round((data[i].me.postMmr - data[i].me.preMmr) * 100) / 100;
                                }
                            }
                        });
                    }
                } else {
                    if (data[i].mode == '1v1') {
                        if (data[i].me.postMmr) {
                            charactersHisto.push(
                                {
                                    "character": data[i].me.character,
                                    "win1": 0,
                                    "lose1": 0,
                                    "win2": 0,
                                    "lose2": 0,
                                    "mmrDiff1": Math.round((data[i].me.postMmr - data[i].me.preMmr) * 100) / 100,
                                    "mmrDiff2": 0
                                }
                            );
                        } else {
                            charactersHisto.push(
                                {
                                    "character": data[i].me.character,
                                    "win1": 0,
                                    "lose1": 0,
                                    "win2": 0,
                                    "lose2": 0,
                                    "mmrDiff1": 0,
                                    "mmrDiff2": 0
                                }
                            );
                        }
                    }
                    if (data[i].mode == '2v2') {
                        if (data[i].me.postMmr) {
                            charactersHisto.push(
                                {
                                    "character": data[i].me.character,
                                    "win1": 0,
                                    "lose1": 0,
                                    "win2": 0,
                                    "lose2": 0,
                                    "mmrDiff1": 0,
                                    "mmrDiff2": Math.round((data[i].me.postMmr - data[i].me.preMmr) * 100) / 100
                                }
                            );
                        } else {
                            charactersHisto.push(
                                {
                                    "character": data[i].me.character,
                                    "win1": 0,
                                    "lose1": 0,
                                    "win2": 0,
                                    "lose2": 0,
                                    "mmrDiff1": 0,
                                    "mmrDiff2": 0
                                }
                            );
                        }
                    }
                }
                if (data[i].mode == '1v1') {
                    if (data[i].result == "win") {
                        charactersHisto.find((x, y) => {
                            if (x.character ==  data[i].me.character) {
                                charactersHisto[y].win1 = x.win1 + 1;
                            };
                        });
                    }
                    if (data[i].result == "lose") {
                        charactersHisto.find((x, y) => {
                            if (x.character ==  data[i].me.character) {
                                charactersHisto[y].lose1 = x.lose1 + 1;
                            };
                        });
                    }
                }
                if (data[i].mode == '2v2') {
                    if (data[i].result == "win") {
                        charactersHisto.find((x, y) => {
                            if (x.character ==  data[i].me.character) {
                                charactersHisto[y].win2 = x.win2 + 1;
                            };
                        });
                    }
                    if (data[i].result == "lose") {
                        charactersHisto.find((x, y) => {
                            if (x.character ==  data[i].me.character) {
                                charactersHisto[y].lose2 = x.lose2 + 1;
                            };
                        });
                    }
                }
            }
        }
    }
    let htmlOptions = '';
    for (let j = 0; j < charactersHisto.length; j++) {
        htmlOptions += '<option value="' + charactersHisto[j].character + '">' +
            charactersHisto[j].character.replace("_", " ").replace("_", " ") +
            '</option>';
    }
    $('#selectCharacter').html('<option class="json-txt-all"></option>' + htmlOptions);
    loadCharacterMmr('All');
    $("#match-table-body").html(dataGames);
    getTextAccountByLang(userLang);
}

function createLine(data) {
    let html = "";
    if (data.mode == '1v1') {
        if (data.result == "win") {
            html += '<tr class="border border-dark degrade-win">';
        } else if (data.result == "lose") {
            html += '<tr class="border border-dark degrade-lose">';
        }
        mmrDiffMe = Math.round((data.me.postMmr - data.me.preMmr) * 100) / 100;
        mmrDiffEnemy = Math.round((data.enemy.postMmr - data.enemy.preMmr) * 100) / 100;
        html += '<td style="width:5em;">' + dataDate + "</td>";
        html +=
            '<td style="width:5em;"></td>' +
            '<td style="width:5em;"><a class="btn m-0 p-0" data-bs-toggle="tooltip" data-bs-placement="bottom" title="' + data.me.username + '" href="account.html?name=' + data.me.username +
            '"><img style="max-height:5em; width:auto;" src="/img/perso/' + data.me.character + '.jpg"></a><p class="text-light p-0 m-0">' +
            notIsNaN(Math.round(data.me.preMmr * 100) / 100) +
            "</p> " +
            formateMmrDiff(mmrDiffMe) +
            "</td>" +
            "<td>VS</td>" +
            '<td style="width:5em;">' +
            '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" ';
        if (isBot(data.enemy.username)) {
            html += 'title="BOT"';
        } else {
            html += 'title="' + data.enemy.username + '" href="account.html?name=' + data.enemy.username + '"';
        }
        html +=
            ">" +
            '<img style="max-height:5em; width:auto;" src="/img/perso/' + data.enemy.character + '.jpg"></a><p class="text-light p-0 m-0">' +
            notIsNaN(Math.round(data.enemy.preMmr * 100) / 100) +
            "</p> " +
            formateMmrDiff(mmrDiffEnemy) +
            "</td>" +
            '<td style="width:5em;"></td>' +
            '<td><p class="grey json-txt-map"></p><p class="json-txt-' + data.mapName + '"></p></td>' +
            '<td><p class="grey json-txt-duration"></p>' + data.duration + "</td>" +
            '<td><p class="grey json-txt-me"></p>' + data.me.damageDone + "<p>" + data.me.ringOuts + " - " + data.me.deaths + "</p></td>" +
            "<td></td>" +
            '<td><p class="grey json-txt-enemy"></p>' + data.enemy.damageDone + "<p>" + data.enemy.ringOuts + " - " + data.enemy.deaths + "</p></td>" +
            "<td></td>" +
            "</tr>";
    }
    if (data.mode == '2v2') {
        if (data.result == "win") {
            html += '<tr class="border border-dark degrade-win">';
        } else if (data.result == "lose") {
            html += '<tr class="border border-dark degrade-lose">';
        }
        mmrDiffMe = Math.round((data.me.postMmr - data.me.preMmr) * 100) / 100;
        mmrDiffAlly = Math.round((data.ally.postMmr - data.ally.preMmr) * 100) / 100;
        mmrDiffEnemy = Math.round((data.enemy.postMmr - data.enemy.preMmr) * 100) / 100;
        mmrDiffEnemy2 = Math.round((data.enemy2.postMmr - data.enemy2.preMmr) * 100) / 100;
        
        html += '<td style="width:5em;">' + dataDate + "</td>";
        html +=
            '<td style="width:5em;"><a class="btn m-0 p-0" data-bs-toggle="tooltip" data-bs-placement="bottom" title="' + data.me.username + '" href="account.html?name=' + data.me.username +
            '"><img style="max-height:5em; width:auto;" src="/img/perso/' + data.me.character + '.jpg"></a><p class="text-light p-0 m-0">' +
            notIsNaN(Math.round(data.me.preMmr * 100) / 100) +
            "</p>" +
            formateMmrDiff(mmrDiffMe) +
            "</td>" +
            '<td style="width:5em;">' +
            '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" ';
        if (isBot(data.ally.username)) {
            html += 'title="BOT"';
        } else {
            html += 'title="' + data.ally.username + '" href="account.html?name=' + data.ally.username + '"';
        }
        html +=
            ">" +
            '<img style="max-height:5em; width:auto;" src="/img/perso/' + data.ally.character + '.jpg"></a><p class="text-light p-0 m-0">' +
            notIsNaN(Math.round(data.ally.preMmr * 100) / 100) +
            "</p>" +
            formateMmrDiff(mmrDiffAlly) +
            "</td>" +
            "<td>VS</td>" +
            '<td style="width:5em;">' +
            '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" ';
        if (isBot(data.enemy.username)) {
            html += 'title="BOT"';
        } else {
            html += 'title="' + data.enemy.username + '" href="account.html?name=' + data.enemy.username + '"';
        }
        html +=
            ">" +
            '<img style="max-height:5em; width:auto;" src="/img/perso/' + data.enemy.character + '.jpg"></a><p class="text-light p-0 m-0">' +
            notIsNaN(Math.round(data.enemy.preMmr * 100) / 100) +
            "</p>" +
            formateMmrDiff(mmrDiffEnemy) +
            "</td>" +
            '<td style="width:5em;">' +
            '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" ';
        if (isBot(data.enemy2.username)) {
            html += 'title="BOT"';
        } else {
            html += 'title="' + data.enemy2.username + '" href="account.html?name=' + data.enemy2.username + '"';
        }
        html +=
            ">" +
            '<img style="max-height:5em; width:auto;" src="/img/perso/' + data.enemy2.character + '.jpg"></a><p class="text-light p-0 m-0">' +
            notIsNaN(Math.round(data.enemy2.preMmr * 100) / 100) +
            "</p>" +
            formateMmrDiff(mmrDiffEnemy2) +
            "</td>" +
            '<td><p class="grey json-txt-map"></p><p class="json-txt-' + data.mapName + '"></p></td>' +
            '<td><p class="grey json-txt-duration"></p>' + data.duration + "</td>" +
            '<td><p class="grey json-txt-me"></p>' + data.me.damageDone + "<p>" + data.me.ringOuts + " - " + data.me.deaths + "</p></td>" +
            '<td><p class="grey json-txt-ally"></p>' + data.ally.damageDone + "<p>" + data.ally.ringOuts + " - " + data.ally.deaths + "</p></td>" +
            '<td><p class="grey json-txt-enemy"></p>' + data.enemy.damageDone + "<p>" + data.enemy.ringOuts + " - " + data.enemy.deaths + "</p></td>" +
            '<td><p class="grey json-txt-enemy"></p>' + data.enemy2.damageDone + "<p>" + data.enemy2.ringOuts + " - " + data.enemy2.deaths + "</p></td>" +
            "</tr>";
    }
    return html;
}

function loadCharacterMmr(character) {
    console.log(charactersHisto);
    if (character == "All" ||character == "Tous") {
        let totalWin1 = 0, totalLose1 = 0, totalWin2 = 0, totalLose2 = 0;
        for (let i = 0; i < charactersHisto.length; i++) {
            totalWin1 += charactersHisto[i].win1;
            totalLose1 += charactersHisto[i].lose1;
            totalWin2 += charactersHisto[i].win2;
            totalLose2 += charactersHisto[i].lose2;
        }
        if ((totalWin1 + totalLose1) != 0) {
            $('#count1').html('1v1 => <span class="green px-1">' + totalWin1 + 'W </span>-<span class="red px-1"> ' + totalLose1 + 'L </span><span class="px-1 grey">(' + Math.round(totalWin1 / (totalWin1 + totalLose1) * 100) + '%)</span>');
        } else {
            $('#count1').html('');
        }
        if ((totalWin2 + totalLose2) != 0) {
            $('#count2').html('2v2 => <span class="green px-1">' + totalWin2 + 'W </span>-<span class="red px-1"> ' + totalLose2 + 'L </span><span class="px-1 grey">(' + Math.round(totalWin2 / (totalWin2 + totalLose2) * 100) + '%)</span>');
        } else {
            $('#count2').html('');
        }
    }
    charactersHisto.find((x, y) => {
        if (x.character ==  character) {
            if ((x.win1 + x.lose1) != 0) {
                $('#count1').html('1v1 => <span class="green px-1">' + x.win1 + 'W </span>-<span class="red px-1"> ' + x.lose1 + 'L </span><span class="px-1 grey">(' + Math.round(x.win1 / (x.win1 + x.lose1) * 100) + '%)</span> ' + formateCountMmrDiff(x.mmrDiff1));
            } else {
                $('#count1').html('');
            }
            if ((x.win2 + x.lose2) != 0) {
                $('#count2').html('2v2 => <span class="green px-1">' + x.win2 + 'W </span>-<span class="red px-1"> ' + x.lose2 + 'L </span><span class="px-1 grey">(' + Math.round(x.win2 / (x.win2 + x.lose2) * 100) + '%)</span> ' + formateCountMmrDiff(x.mmrDiff2));
            } else {
                $('#count2').html('');
            }
        }
    });
}

function viewsSearchResult(data) {
    let res = "";
    for (let i = 0; i < data.result.length; i++) {
        res +=
            '<div class="col card text-center" style="width: fit-content;"><a style="text-decoration: none;" href="account.html?name=' + data.result[i].username +
            '"><img style="height:8em; width:8em;" class="mx-auto" src="/img/profil/' + data.result[i].avatar + '.jpg"/><p class="mb-0 txt-normal text-dark">' +
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

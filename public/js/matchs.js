const urlParams = new URLSearchParams(window.location.search);
const GETname = urlParams.get('name');
var userLang = navigator.language || navigator.userLanguage;
userLang = userLang.slice(0,2);
var page = 1;

$(function() {
    $('title').html("Multiversus - Matchs - " + GETname);

    getTextNavByLang(userLang);
    getTextMatchsByLang(userLang);

    getDataByName(GETname);

    window.onscroll = () => {
        var posActu = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var posMax = document.documentElement.scrollHeight-window.innerHeight;
        
        if (posActu == posMax) {
            page += 1;
            if (page < 20) {
                $('#loader-more-matchs').css('visibility', 'visible');
                fetch('mvsstatmatchs?name='+GETname+'&page='+page)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        veiwsMoreInfoMatchs(data.matches);
                        $('#loader-more-matchs').css('visibility', 'hidden');
                        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                            return new bootstrap.Tooltip(tooltipTriggerEl)
                        })
                    }
                });
            }
        }
    }
});

function getDataByName(name) {

    fetch('mvsstatmatchs?name='+name)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                $('#loader').css('display', 'none');
                if (data.matches[Object.keys(data.matches)[0]]) {
                    veiwsInfoMatchs(data.matches);
                } else {
                    page += 1;
                    fetch('mvsstatmatchs?name='+GETname+'&page='+page)
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            loop(data);
                        }
                    });
                }
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl)
                })
            }
    });

}

function loop(data) {
    if (data.matches[Object.keys(data.matches)[0]]) {
        veiwsInfoMatchs(data.matches);
    } else {
        page += 1;
        if (page == 20) {
            return;
        }
        fetch('mvsstatmatchs?name='+GETname+'&page='+page)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                loop(data);
            }
        });
    }
}

//* module datatable for sorting
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "formatted-num-pre": function ( a ) {
        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },
 
    "formatted-num-asc": function ( a, b ) {
        return a - b;
    },
 
    "formatted-num-desc": function ( a, b ) {
        return b - a;
    }
} );

function veiwsInfoMatchs(data) {
    let dataGames = '';
    let dataGameOne = '';
    let first = true;
    
    for (let i = 0; i < 25; i++) {
        if (data[i] && first) {
            first = false;
            let mmrDiffMe, mmrDiffAlly, mmrDiffEnemy, mmrDiffEnemy2;
            let date = new Date().toISOString();
            let yearActu = Number(date.slice(0,4));
            let monthActu = Number(date.slice(5,7));
            let dayActu = Number(date.slice(8,10));
            let hoursActu = Number(date.slice(11,13));
            let minutesActu = Number(date.slice(14,16));
            let dateActu = new Date(yearActu, monthActu, dayActu, hoursActu, minutesActu);
            
            let yearGame = Number((data[i].completion_time).slice(0,4));
            let monthGame = Number((data[i].completion_time).slice(5,7));
            let dayGame = Number((data[i].completion_time).slice(8,10));
            let hoursGame = Number((data[i].completion_time).slice(11,13));
            let minutesGame = Number((data[i].completion_time).slice(14,16));
            let dateGame = new Date(yearGame, monthGame, dayGame, hoursGame, minutesGame);
            dataDate = getTimeBetween(dateGame, dateActu, userLang);

            if (data[i].result == "win") {
                $('#gameOne').addClass("border border-dark degrade-top-win");
            } else if (data[i].result == "lose") {
                $('#gameOne').addClass("border border-dark degrade-top-lose");
            }  
            if (data[i].mode == '1v1') {
                mmrDiffMe = Math.round(((Math.round(data[i].me.postMmr*100)/100) - (Math.round(data[i].me.preMmr*100)/100))*100)/100;
                mmrDiffEnemy = Math.round(((Math.round(data[i].enemy.postMmr*100)/100) - (Math.round(data[i].enemy.preMmr*100)/100))*100)/100;
                dataGameOne =   '<div class="row text-center text-light mb-2 pt-4">'+
                                    '<div class="col">'+
                                        '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].me.username+'" href="account.html?name='+data[i].me.username+'">'+
                                        '<img src="/img/perso/'+data[i].me.character+'.jpg" style="max-height:7em; width:auto;"></a>'+
                                        '<p class="text-light">'+data[i].me.username+'</p>'+
                                        '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].me.preMmr*100)/100)+'</p>'+
                                        formateMmrDiff(mmrDiffMe)+
                                        '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].me.postMmr*100)/100)+'</p>'+
                                        '<div class="d-inline-block txt-normal mt-2">'+
                                            '<p class="grey m-0 d-inline-block json-txt-damage"></p><p class="text-light d-inline-block ms-2">'+data[i].me.damageDone+'</p>'+
                                            '<p class="grey m-0 d-inline-block ms-3 json-txt-kill"></p><p class="text-light d-inline-block ms-2">'+data[i].me.ringOuts+'</p>'+
                                            '<p class="grey m-0 d-inline-block ms-3 json-txt-death"></p><p class="text-light d-inline-block ms-2">'+data[i].me.deaths+'</p>'+
                                        '</div><br>'+
                                        '<div class="d-inline-block">';
                                        if (data[i].me.perks) {
                                            if (data[i].me.perks.perks1 != "") {
                                                dataGameOne += '<img style="height:4em; width:auto;" src="/img/perks/'+data[i].me.perks.perks1+'.png" />';
                                            }
                                            if (data[i].me.perks.perks2 != "") {
                                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].me.perks.perks2+'.png" />';
                                            }
                                            if (data[i].me.perks.perks3 != "") {
                                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].me.perks.perks3+'.png" />';
                                            }
                                            if (data[i].me.perks.perks4 != "") {
                                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].me.perks.perks4+'.png" />';
                                            }
                                        }
                    dataGameOne +=  '</div>'+
                                '</div><div class="col txt-big pt-5">'+
                                '<div class="text-center"><p class="text-light">'+dataDate+'</p>'+
                                '<p class="grey m-0 json-txt-duration"></p><p class="text-light">'+data[i].duration+'</p>'+
                                '<p class="grey m-0 json-txt-map"></p><p class="text-light json-txt-'+data[i].mapName+'"></p></div>'+
                                '</div><div class="col">'+
                                    '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy.username+'" href="account.html?name='+data[i].enemy.username+'">'+
                                    '<img src="/img/perso/'+data[i].enemy.character+'.jpg" style="max-height:7em; width:auto;"></a>'+
                                    '<p class="text-light">'+data[i].enemy.username+'</p>'+
                                    '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].enemy.preMmr*100)/100)+'</p>'+
                                    formateMmrDiff(mmrDiffEnemy)+
                                    '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].enemy.postMmr*100)/100)+'</p>'+
                                    '<div class="d-inline-block txt-normal mt-2">'+
                                        '<p class="grey m-0 d-inline-block json-txt-damage"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy.damageDone+'</p>'+
                                        '<p class="grey m-0 d-inline-block ms-3 json-txt-kill"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy.ringOuts+'</p>'+
                                        '<p class="grey m-0 d-inline-block ms-3 json-txt-death"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy.deaths+'</p>'+
                                    '</div><br>'+
                                    '<div class="d-inline-block">';
                                    if (data[i].enemy.perks) {
                                        if (data[i].enemy.perks.perks1 != "") {
                                            dataGameOne += '<img style="height:4em; width:auto;" src="/img/perks/'+data[i].enemy.perks.perks1+'.png" />';
                                        }
                                        if (data[i].enemy.perks.perks2 != "") {
                                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy.perks.perks2+'.png" />';
                                        }
                                        if (data[i].enemy.perks.perks3 != "") {
                                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy.perks.perks3+'.png" />';
                                        }
                                        if (data[i].enemy.perks.perks4 != "") {
                                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy.perks.perks4+'.png" />';
                                        }
                                    }
                        dataGameOne +=   '</div>'+
                                    '</div>'+
                                '</div><div class="col"></div></div>'+
                                '</div>';
            }
            if (data[i].mode == '2v2') { 
                
                mmrDiffMe = Math.round(((Math.round(data[i].me.postMmr*100)/100) - (Math.round(data[i].me.preMmr*100)/100))*100)/100;
                mmrDiffAlly = Math.round(((Math.round(data[i].ally.postMmr*100)/100) - (Math.round(data[i].ally.preMmr*100)/100))*100)/100;
                mmrDiffEnemy = Math.round(((Math.round(data[i].enemy.postMmr*100)/100) - (Math.round(data[i].enemy.preMmr*100)/100))*100)/100;
                mmrDiffEnemy2 = Math.round(((Math.round(data[i].enemy2.postMmr*100)/100) - (Math.round(data[i].enemy2.preMmr*100)/100))*100)/100;
dataGameOne =   '<div class="row text-center text-light mb-2 pt-4">'+
                    '<div class="col"> '+
                        '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].me.username+'" href="account.html?name='+data[i].me.username+'">'+
                        '<img src="/img/perso/'+data[i].me.character+'.jpg" style="max-height:7em; width:auto;"></a>'+
                        '<p class="text-light">'+data[i].me.username+'</p>'+
                        '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].me.preMmr*100)/100)+'</p>'+
                        formateMmrDiff(mmrDiffMe)+
                        '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].me.postMmr*100)/100)+'</p>'+
                        '<div class="d-inline-block txt-normal mt-2">'+
                            '<p class="grey m-0 d-inline-block json-txt-damage"></p><p class="text-light d-inline-block ms-2">'+data[i].me.damageDone+'</p>'+
                            '<p class="grey m-0 d-inline-block ms-3 json-txt-kill"></p><p class="text-light d-inline-block ms-2">'+data[i].me.ringOuts+'</p>'+
                            '<p class="grey m-0 d-inline-block ms-3 json-txt-death"></p><p class="text-light d-inline-block ms-2">'+data[i].me.deaths+'</p>'+
                        '</div><br>'+
                        '<div class="d-inline-block"">';
                        if (data[i].me.perks) {
                            if (data[i].me.perks.perks1 != "") {
                                dataGameOne += '<img style="height:4em; width:auto;" src="/img/perks/'+data[i].me.perks.perks1+'.png" />';
                            }
                            if (data[i].me.perks.perks2 != "") {
                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].me.perks.perks2+'.png" />';
                            }
                            if (data[i].me.perks.perks3 != "") {
                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].me.perks.perks3+'.png" />';
                            }
                            if (data[i].me.perks.perks4 != "") {
                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].me.perks.perks4+'.png" />';
                            }
                        }
        dataGameOne +=  '</div>'+
                    '</div><div class="col">'+
                        '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].ally.username+'" href="account.html?name='+data[i].ally.username+'">'+
                        '<img src="/img/perso/'+data[i].ally.character+'.jpg" style="max-height:7em; width:auto;"></a>'+
                        '<p class="text-light">'+data[i].ally.username+'</p>'+
                        '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].ally.preMmr*100)/100)+'</p>'+
                        formateMmrDiff(mmrDiffAlly)+
                        '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].ally.postMmr*100)/100)+'</p>'+
                        '<div class="d-inline-block txt-normal mt-2">'+
                            '<p class="grey m-0 d-inline-block json-txt-damage"></p><p class="text-light d-inline-block ms-2">'+data[i].ally.damageDone+'</p>'+
                            '<p class="grey m-0 d-inline-block ms-3 json-txt-kill"></p><p class="text-light d-inline-block ms-2">'+data[i].ally.ringOuts+'</p>'+
                            '<p class="grey m-0 d-inline-block ms-3 json-txt-death"></p><p class="text-light d-inline-block ms-2">'+data[i].ally.deaths+'</p>'+
                        '</div><br>'+
                        '<div class="d-inline-block">';
                        if (data[i].ally.perks) {
                            if (data[i].ally.perks.perks1 != "") {
                                dataGameOne += '<img style="height:4em; width:auto;" src="/img/perks/'+data[i].ally.perks.perks1+'.png" />';
                            }
                            if (data[i].ally.perks.perks2 != "") {
                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].ally.perks.perks2+'.png" />';
                            }
                            if (data[i].ally.perks.perks3 != "") {
                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].ally.perks.perks3+'.png" />';
                            }
                            if (data[i].ally.perks.perks4 != "") {
                                dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].ally.perks.perks4+'.png" />';
                            }
                        }
        dataGameOne +=  '</div>'+
                '</div><div class="col txt-big pt-5">'+
                '<div class="text-center"><p class="text-light">'+dataDate+'</p>'+
                '<p class="grey m-0 json-txt-duration"></p><p class="text-light">'+data[i].duration+'</p>'+
                '<p class="grey m-0 json-txt-map"></p><p class="text-light json-txt-'+data[i].mapName+'"></p></div>'+
                '</div><div class="col">'+
                    '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy.username+'" href="account.html?name='+data[i].enemy.username+'">'+
                    '<img src="/img/perso/'+data[i].enemy.character+'.jpg" style="max-height:7em; width:auto;"></a>'+
                    '<p class="text-light">'+data[i].enemy.username+'</p>'+
                    '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].enemy.preMmr*100)/100)+'</p>'+
                    formateMmrDiff(mmrDiffEnemy)+
                    '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].enemy.postMmr*100)/100)+'</p>'+
                    '<div class="d-inline-block txt-normal mt-2">'+
                        '<p class="grey m-0 d-inline-block json-txt-damage"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy.damageDone+'</p>'+
                        '<p class="grey m-0 d-inline-block ms-3 json-txt-kill"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy.ringOuts+'</p>'+
                        '<p class="grey m-0 d-inline-block ms-3 json-txt-death"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy.deaths+'</p>'+
                    '</div><br>'+
                    '<div class="d-inline-block">';
                    if (data[i].enemy.perks) {
                        if (data[i].enemy.perks.perks1 != "") {
                            dataGameOne += '<img style="height:4em; width:auto;" src="/img/perks/'+data[i].enemy.perks.perks1+'.png" />';
                        }
                        if (data[i].enemy.perks.perks2 != "") {
                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy.perks.perks2+'.png" />';
                        }
                        if (data[i].enemy.perks.perks3 != "") {
                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy.perks.perks3+'.png" />';
                        }
                        if (data[i].enemy.perks.perks4 != "") {
                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy.perks.perks4+'.png" />';
                        }
                    }
        dataGameOne +=  '</div>'+
                '</div><div class="col">'+
                    '<a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy2.username+'" href="account.html?name='+data[i].enemy2.username+'">'+
                    '<img src="/img/perso/'+data[i].enemy2.character+'.jpg" style="max-height:7em; width:auto;"></a>'+
                    '<p class="text-light">'+data[i].enemy2.username+'</p>'+
                    '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].enemy2.preMmr*100)/100)+'</p>'+
                    formateMmrDiff(mmrDiffEnemy2)+
                    '<p class="text-light m-0">'+notIsNaN(Math.round(data[i].enemy2.postMmr*100)/100)+'</p>'+
                    '<div class="d-inline-block txt-normal mt-2">'+
                        '<p class="grey m-0 d-inline-block json-txt-damage"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy2.damageDone+'</p>'+
                        '<p class="grey m-0 d-inline-block ms-3 json-txt-kill"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy2.ringOuts+'</p>'+
                        '<p class="grey m-0 d-inline-block ms-3 json-txt-death"></p><p class="text-light d-inline-block ms-2">'+data[i].enemy2.deaths+'</p>'+
                    '</div><br>'+
                    '<div class="d-inline-block">';
                    if (data[i].enemy2.perks) {
                        if (data[i].enemy2.perks.perks1 != "") {
                            dataGameOne += '<img style="height:4em; width:auto;" src="/img/perks/'+data[i].enemy2.perks.perks1+'.png" />';
                        }
                        if (data[i].enemy2.perks.perks2 != "") {
                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy2.perks.perks2+'.png" />';
                        }
                        if (data[i].enemy2.perks.perks3 != "") {
                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy2.perks.perks3+'.png" />';
                        }
                        if (data[i].enemy2.perks.perks4 != "") {
                            dataGameOne += '<img style="height:3em; width:auto;" src="/img/perks/'+data[i].enemy2.perks.perks4+'.png" />';
                        }
                    }
        dataGameOne +=  '</div>'+
                '</div></div></div>';
            }
            $('#gameOne').html(dataGameOne);
        } else if (data[i]) {
            let date = new Date().toISOString();
            let yearActu = Number(date.slice(0,4));
            let monthActu = Number(date.slice(5,7));
            let dayActu = Number(date.slice(8,10));
            let hoursActu = Number(date.slice(11,13));
            let minutesActu = Number(date.slice(14,16));
            let dateActu = new Date(yearActu, monthActu, dayActu, hoursActu, minutesActu);
            
            let yearGame = Number((data[i].completion_time).slice(0,4));
            let monthGame = Number((data[i].completion_time).slice(5,7));
            let dayGame = Number((data[i].completion_time).slice(8,10));
            let hoursGame = Number((data[i].completion_time).slice(11,13));
            let minutesGame = Number((data[i].completion_time).slice(14,16));
            let dateGame = new Date(yearGame, monthGame, dayGame, hoursGame, minutesGame);
            dataDate = getTimeBetween(dateGame, dateActu, userLang);
            if (data[i].result == "win") {
                dataGames += '<tr class="border border-dark degrade-win">';   //   </tr>
            } else if (data[i].result == "lose") {
                dataGames += '<tr class="border border-dark degrade-lose">';
            }
                if (data[i].mode == '1v1') {

                    mmrDiffMe = Math.round(((Math.round(data[i].me.postMmr*100)/100) - (Math.round(data[i].me.preMmr*100)/100))*100)/100;
                    mmrDiffEnemy = Math.round(((Math.round(data[i].enemy.postMmr*100)/100) - (Math.round(data[i].enemy.preMmr*100)/100))*100)/100;

                    dataGames += '<td style="width:5em;">'+dataDate+'</td>';
                    dataGames += '<td style="width:5em;"></td>'+
                                '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].me.username+'" href="account.html?name='+data[i].me.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].me.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].me.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffMe)+'</td>' +
                                '<td></td>' +
                                '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy.username+'" href="account.html?name='+data[i].enemy.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].enemy.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].enemy.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffEnemy)+'</td>' +
                                '<td style="width:5em;"></td>'+
                                '<td><p class="grey json-txt-map"></p><p class="json-txt-'+data[i].mapName+'"></p></td>' +
                                '<td><p class="grey json-txt-duration"></p>' + data[i].duration + '</td>' +
                                '<td><p class="grey json-txt-me"></p>' + data[i].me.damageDone + '<p>' + data[i].me.ringOuts + ' - ' + data[i].me.deaths + '</p></td>' +
                                '<td></td>' +
                                '<td><p class="grey json-txt-enemy"></p>' + data[i].enemy.damageDone + '<p>' + data[i].enemy.ringOuts + ' - ' + data[i].enemy.deaths + '</p></td>' +
                                '<td></td>' +
                            '</tr>';
                }
            
                if (data[i].mode == '2v2') {

                    mmrDiffMe = Math.round(((Math.round(data[i].me.postMmr*100)/100) - (Math.round(data[i].me.preMmr*100)/100))*100)/100;
                    mmrDiffAlly = Math.round(((Math.round(data[i].ally.postMmr*100)/100) - (Math.round(data[i].ally.preMmr*100)/100))*100)/100;
                    mmrDiffEnemy = Math.round(((Math.round(data[i].enemy.postMmr*100)/100) - (Math.round(data[i].enemy.preMmr*100)/100))*100)/100;
                    mmrDiffEnemy2 = Math.round(((Math.round(data[i].enemy2.postMmr*100)/100) - (Math.round(data[i].enemy2.preMmr*100)/100))*100)/100;

                    dataGames += '<td style="width:5em;">'+dataDate+'</td>';
                    dataGames += '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].me.username+'" href="account.html?name='+data[i].me.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].me.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].me.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffMe)+'</td>' +
                                    '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].ally.username+'" href="account.html?name='+data[i].ally.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].ally.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].ally.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffAlly)+'</td>' +
                                    '<td></td>' +
                                    '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy.username+'" href="account.html?name='+data[i].enemy.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].enemy.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].enemy.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffEnemy)+'</td>' +
                                    '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy2.username+'" href="account.html?name='+data[i].enemy2.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].enemy2.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].enemy2.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffEnemy2)+'</td>'+
                                    '<td><p class="grey json-txt-map"></p><p class="json-txt-'+data[i].mapName+'"></p></td>' +
                                    '<td><p class="grey json-txt-duration"></p>' + data[i].duration + '</td>' +
                                    '<td><p class="grey json-txt-me"></p>' + data[i].me.damageDone + '<p>' + data[i].me.ringOuts + ' - ' + data[i].me.deaths + '</p></td>' +
                                    '<td><p class="grey json-txt-ally"></p>' + data[i].ally.damageDone + '<p>' + data[i].ally.ringOuts + ' - ' + data[i].ally.deaths + '</p></td>' +
                                    '<td><p class="grey json-txt-enemy"></p>' + data[i].enemy.damageDone + '<p>' + data[i].enemy.ringOuts + ' - ' + data[i].enemy.deaths + '</p></td>' +
                                    '<td><p class="grey json-txt-enemy"></p>' + data[i].enemy2.damageDone + '<p>' + data[i].enemy2.ringOuts + ' - ' + data[i].enemy2.deaths + '</p></td>' +
                                '</tr>';
                }
            }
        }
    $('#match-table-body').html(dataGames);
    getTextMatchsByLang(userLang);
}

function veiwsMoreInfoMatchs(data) {
    let dataGames = '';
    
    let date = new Date().toISOString();
    let yearActu = Number(date.slice(0,4));
    let monthActu = Number(date.slice(5,7));
    let dayActu = Number(date.slice(8,10));
    let hoursActu = Number(date.slice(11,13));
    let minutesActu = Number(date.slice(14,16));
    let dateActu = new Date(yearActu, monthActu, dayActu, hoursActu, minutesActu);
    
    for (let i = 0; i < 25; i++) {
        if (data[i]) {
            let liste = [0,1,2,3];
            let yearGame = Number((data[i].completion_time).slice(0,4));
            let monthGame = Number((data[i].completion_time).slice(5,7));
            let dayGame = Number((data[i].completion_time).slice(8,10));
            let hoursGame = Number((data[i].completion_time).slice(11,13));
            let minutesGame = Number((data[i].completion_time).slice(14,16));
            let dateGame = new Date(yearGame, monthGame, dayGame, hoursGame, minutesGame);

            if (data[i].mode == '1v1') {
                dataDate = getTimeBetween(dateGame, dateActu, userLang);

                if (data[i].result == "win") {
                    dataGames += '<tr class="border border-dark degrade-win">';   //   </tr>
                } else if (data[i].result == "lose") {
                    dataGames += '<tr class="border border-dark degrade-lose">';
                }
                mmrDiffMe = Math.round(((Math.round(data[i].me.postMmr*100)/100) - (Math.round(data[i].me.preMmr*100)/100))*100)/100;
                mmrDiffEnemy = Math.round(((Math.round(data[i].enemy.postMmr*100)/100) - (Math.round(data[i].enemy.preMmr*100)/100))*100)/100;

                dataGames += '<td style="width:5em;">'+dataDate+'</td>';
                dataGames += '<td style="width:5em;"></td>'+
                            '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].me.username+'" href="account.html?name='+data[i].me.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].me.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].me.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffMe)+'</td>' +
                            '<td></td>' +
                            '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy.username+'" href="account.html?name='+data[i].enemy.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].enemy.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].enemy.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffEnemy)+'</td>' +
                            '<td style="width:5em;"></td>'+
                            '<td><p class="grey json-txt-map"></p><p class="json-txt-'+data[i].mapName+'"></p></td>' +
                            '<td><p class="grey json-txt-duration"></p>' + data[i].duration + '</td>' +
                            '<td><p class="grey json-txt-me"></p>' + data[i].me.damageDone + '<p>' + data[i].me.ringOuts + ' - ' + data[i].me.deaths + '</p></td>' +
                            '<td></td>' +
                            '<td><p class="grey json-txt-enemy"></p>' + data[i].enemy.damageDone + '<p>' + data[i].enemy.ringOuts + ' - ' + data[i].enemy.deaths + '</p></td>' +
                            '<td></td>' +
                        '</tr>';
            }
        
            if (data[i].mode == '2v2') {
                dataDate = getTimeBetween(dateGame, dateActu, userLang);

                if (data[i].result == "win") {
                    dataGames += '<tr class="border border-dark degrade-win">';   //   </tr>
                } else if (data[i].result == "lose") {
                    dataGames += '<tr class="border border-dark degrade-lose">';
                }   
                mmrDiffMe = Math.round(((Math.round(data[i].me.postMmr*100)/100) - (Math.round(data[i].me.preMmr*100)/100))*100)/100;
                mmrDiffAlly = Math.round(((Math.round(data[i].ally.postMmr*100)/100) - (Math.round(data[i].ally.preMmr*100)/100))*100)/100;
                mmrDiffEnemy = Math.round(((Math.round(data[i].enemy.postMmr*100)/100) - (Math.round(data[i].enemy.preMmr*100)/100))*100)/100;
                mmrDiffEnemy2 = Math.round(((Math.round(data[i].enemy2.postMmr*100)/100) - (Math.round(data[i].enemy2.preMmr*100)/100))*100)/100;

                dataGames += '<td style="width:5em;">'+dataDate+'</td>';
                dataGames += '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].me.username+'" href="account.html?name='+data[i].me.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].me.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].me.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffMe)+'</td>' +
                                '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].ally.username+'" href="account.html?name='+data[i].ally.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].ally.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].ally.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffAlly)+'</td>' +
                                '<td></td>' +
                                '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy.username+'" href="account.html?name='+data[i].enemy.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].enemy.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].enemy.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffEnemy)+'</td>' +
                                '<td style="width:5em;"><a class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="'+data[i].enemy2.username+'" href="account.html?name='+data[i].enemy2.username+'"><img style="max-height:5em; width:auto;" src="/img/perso/' + data[i].enemy2.character + '.jpg"></a><p class="text-light p-0 m-0">'+notIsNaN(Math.round(data[i].enemy2.preMmr*100)/100)+'</p> '+formateMmrDiff(mmrDiffEnemy2)+'</td>'+
                                '<td><p class="grey json-txt-map"></p><p class="json-txt-'+data[i].mapName+'"></p></td>' +
                                '<td><p class="grey json-txt-duration"></p>' + data[i].duration + '</td>' +
                                '<td><p class="grey json-txt-me"></p>' + data[i].me.damageDone + '<p>' + data[i].me.ringOuts + ' - ' + data[i].me.deaths + '</p></td>' +
                                '<td><p class="grey json-txt-ally"></p>' + data[i].ally.damageDone + '<p>' + data[i].ally.ringOuts + ' - ' + data[i].ally.deaths + '</p></td>' +
                                '<td><p class="grey json-txt-enemy"></p>' + data[i].enemy.damageDone + '<p>' + data[i].enemy.ringOuts + ' - ' + data[i].enemy.deaths + '</p></td>' +
                                '<td><p class="grey json-txt-enemy"></p>' + data[i].enemy2.damageDone + '<p>' + data[i].enemy2.ringOuts + ' - ' + data[i].enemy2.deaths + '</p></td>' +
                            '</tr>';
            }
        }
    }
    $('#match-table-body').html($('#match-table-body').html() + dataGames);
    getTextMatchsByLang(userLang);
}

function viewsSearchResult(data) {
    let res = '';
    for (let i = 0; i < data.result.length; i++) {
        res += '<div class="col card text-center" style="width: fit-content;"><a style="text-decoration: none;" href="matchs.html?name='+data.result[i].username+'"><img style="height:8em; width:8em;" class="mx-auto" src="/img/profil/'+data.result[i].avatar+'.jpg"/><p class="mb-0 txt-normal text-dark">'+data.result[i].username+'</p><p class="mb-0 txt-normal grey">lvl '+data.result[i].level+'</p></a></div>'
    }
    $('#search-result').html(res);
    $('#search-box').attr('style','display:block;');
}

function handleKeyPress(e){
    var key=e.keyCode || e.which;
     if (key==13){
        window.location.href = 'matchs.html?name=' + $('#usernameInput').val();
     }
}
var userLang = navigator.language || navigator.userLanguage;
userLang = userLang.slice(0,2);
var dataLoadMmrByRank = 0;

$(function() {
    getTextNavByLang(userLang);
    getTextMoredataByLang(userLang);
    showSelect();
});

//* Module datatable for sorting
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

function showSelect() {
    fetch('mvsstatmoredata?method=loadSave')
        .then(res => res.json())
        .then(data => {
            if (!data.noData) {
                console.log(data);
                if (data.charactersList) {   
                    var htmlSelectMmrByRank = '';
                    var htmlSelectTopCharactersPopularityByMmr = '';
                    var dataLoadMmrByRank = 0;
                    for (let val in data.charactersList[0].leaderboard1v1) {
                        dataLoadMmrByRank += 1;
                    }
                    if (dataLoadMmrByRank == 250) {
                        htmlSelectMmrByRank =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option selected>250</option>';
                        htmlSelectTopCharactersPopularityByMmr =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option selected>500</option>';
                    } else if (dataLoadMmrByRank == 500) {
                        htmlSelectMmrByRank =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option selected>500</option>';
                        htmlSelectTopCharactersPopularityByMmr =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option>500</option>'+
                            '<option>750</option>'+
                            '<option selected>1000</option>';
                    } else if (dataLoadMmrByRank == 750) {
                        htmlSelectMmrByRank =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option>500</option>'+
                            '<option selected>750</option>';
                        htmlSelectTopCharactersPopularityByMmr =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option>500</option>'+
                            '<option>750</option>'+
                            '<option>1000</option>'+
                            '<option selected>1500</option>';
                    } else if (dataLoadMmrByRank == 1000) {
                        htmlSelectMmrByRank =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option>500</option>'+
                            '<option>750</option>'+
                            '<option selected>1000</option>';
                        htmlSelectTopCharactersPopularityByMmr =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option>500</option>'+
                            '<option>750</option>'+
                            '<option>1000</option>'+
                            '<option>1500</option>'+
                            '<option selected>2000</option>';
                    } else if (dataLoadMmrByRank > 1000) {
                        htmlSelectMmrByRank =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option>500</option>'+
                            '<option>750</option>'+
                            '<option>1000</option>'+
                            '<option selected>'+dataLoadMmrByRank+'</option>';
                        htmlSelectTopCharactersPopularityByMmr =
                            '<option>25</option>'+
                            '<option>50</option>'+
                            '<option>100</option>'+
                            '<option>250</option>'+
                            '<option>500</option>'+
                            '<option>750</option>'+
                            '<option>1000</option>'+
                            '<option>1500</option>'+
                            '<option>2000</option>'+
                            '<option selected>2500</option>';
                    }
                    $('#selectMmrByRank').html(htmlSelectMmrByRank);
                    $('#selectTopCharactersPopularityByMmr').html(htmlSelectTopCharactersPopularityByMmr);
                }
                getTextMoredataByLang(userLang);
            }
    });
}

function getCharactersPopularity() {
    $('#loader-charactersPopularity').css('display', 'block');
    $('#charactersPopularity').html("");
    fetch('mvsstatmoredata?method=dataCharactersPopularity')
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            console.log(data);
            viewsDataCharactersPopularity(data);
            $('#loader-charactersPopularity').css('display', 'none');
        }
    });
}

function getMmrByRank(nbDataCharacterRank) {
    if (nbDataCharacterRank) {
        $('#loader-MmrByRank').css('display', 'block');
        $('#MmrByRank').html("");
        fetch('mvsstatmoredata?method=loadSave')
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data);
                viewsDataMmrByRank(data, nbDataCharacterRank);
                $('#loader-MmrByRank').css('display', 'none');
            }
        });
    }
}
 
function getTopCharactersPopularityByMmr(nbDataTopCharactersPopularityByMmr) {
    if (nbDataTopCharactersPopularityByMmr) {
        $('#loader-topCharactersPopularityByMmr').css('display', 'block');
        $('#topCharactersPopularityByMmr').html("");
        fetch('mvsstatmoredata?method=loadSave')
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    console.log(data);
                    fetch('mvsstatmoredata?method=getMmrTop&numTop='+nbDataTopCharactersPopularityByMmr)
                    .then(res2 => res2.json())
                    .then(dataMmr => {
                        if (dataMmr.error) {
                        alert(dataMmr.error);
                    } else {
                        console.log(dataMmr);
                        viewsDataTopCharactersPopularityByMmr(data, dataMmr, nbDataTopCharactersPopularityByMmr);
                        $('#loader-topCharactersPopularityByMmr').css('display', 'none');
                    }
                });
            }
        });
    }
}

function save(data) { //* save('DataMmrByRank')
    $('.spinner-save-data').css('display', 'block');
    $('.spinner-save-data').css('height', $('#btnSaveDataMmrByRank').height());
    $('#btnSaveDataMmrByRank').addClass('disabled');
    $('#btnSaveDataMmrByRank').removeClass('mx-auto');

    fetch('mvsstatmoredata?method=save'+data)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                showSelect();
                $('.spinner-save-data').css('display', 'none');
                $('#btnSaveDataMmrByRank').removeClass('disabled');
                $('#btnSaveDataMmrByRank').addClass('mx-auto');
            }
    });
}

function resetSave() {
    fetch('mvsstatmoredata?method=resetSave')
        .then(res => res.json())
        .then(data => {
            alert(data.res);
            showSelect();
    });
}

function viewsDataCharactersPopularity(data) {
    if (userLang == 'en') {
        $('#title-pie-1v1').html($('#title-pie-1v1').html()+'<span class="txt-normal"> ('+numberWithSpaces(data.charactersList[0].globalTotalPlayers1v1)+' players)</span>');
        $('#title-pie-2v2').html($('#title-pie-2v2').html()+'<span class="txt-normal"> ('+numberWithSpaces(data.charactersList[0].globalTotalPlayers2v2)+' players)</span>');
    } else if (userLang == 'fr') {
        $('#title-pie-1v1').html($('#title-pie-1v1').html()+'<span class="txt-normal"> ('+numberWithSpaces(data.charactersList[0].globalTotalPlayers1v1)+' joueurs)</span>');
        $('#title-pie-2v2').html($('#title-pie-2v2').html()+'<span class="txt-normal"> ('+numberWithSpaces(data.charactersList[0].globalTotalPlayers2v2)+' joueurs)</span>');
    } else {
        $('#title-pie-1v1').html($('#title-pie-1v1').html()+'<span class="txt-normal"> ('+numberWithSpaces(data.charactersList[0].globalTotalPlayers1v1)+' players)</span>');
        $('#title-pie-2v2').html($('#title-pie-2v2').html()+'<span class="txt-normal"> ('+numberWithSpaces(data.charactersList[0].globalTotalPlayers2v2)+' players)</span>');
    }
    let htmlCharactersPopularity = '<div class="row justify-content-center">'+
        '<p class="text-light txt-big text-center" id="title-pie-1v1">1v1</p>'+
        '<div class="col"><canvas id="canvasCharacterPopularity1v1" class="w-100"></canvas></div>'+
        '<div class="col"><table id="datatable1v1" class="bg-dark table-striped text-light text-center">'+
        '<thead><tr><th></th>'+
        '<th class="json-txt-name"></th>'+
        '<th class="text-end json-txt-nbPlayer"></th>'+
        '<th class="text-end json-txt-percentagePlayer"></th>'+
        '</tr></thead></table></div></div>'+
        '<div class="row mt-3">'+
        '<p class="text-light txt-big text-center" id="title-pie-2v2">2v2</p>'+
        '<div class="col"><canvas id="canvasCharacterPopularity2v2" class="w-100"></canvas></div>'+
        '<div class="col"><table id="datatable2v2" class="bg-dark table-striped text-light text-center">'+
        '<thead><tr><th></th>'+
        '<th class="json-txt-name"></th>'+
        '<th class="text-end json-txt-nbPlayer"></th>'+
        '<th class="text-end json-txt-percentagePlayer"></th>'+
        '</tr></thead></table></div>'+
        '</div>';
    $('#charactersPopularity').html(htmlCharactersPopularity);
    getTextMoredataByLang(userLang);

    let total1v1 = 0;
    let total2v2 = 0;
    let totalPlayer1v1 = [];
    let totalPlayer2v2 = [];
    let labels = [];
    let color = [];
    let mmr1v1 = [];
    let mmr2v2 = [];
    for (let i = 0; i < data.charactersList.length; i++) {
        total1v1 += data.charactersList[i].totalPlayer1v1;
        total2v2 += data.charactersList[i].totalPlayer2v2;
    }
    for (let i = 0; i < data.charactersList.length; i++) {
        totalPlayer1v1.push(Math.round(data.charactersList[i].totalPlayer1v1 / total1v1 * 10000) / 100);
        totalPlayer2v2.push(Math.round(data.charactersList[i].totalPlayer2v2 / total2v2 * 10000) / 100);
        labels.push(data.charactersList[i].name.replace('_', ' ').replace('_', ' '));
        color.push(data.charactersList[i].color);
        mmr1v1.push(data.charactersList[i].leaderboard1v1);
        mmr2v2.push(data.charactersList[i].leaderboard2v2);
    }

    const ctxCercleStat1 = document.getElementById('canvasCharacterPopularity1v1').getContext('2d');
    const cercleStat1 = new Chart(ctxCercleStat1, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: totalPlayer1v1,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: 'black'
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });

    const ctxCercleStat2 = document.getElementById('canvasCharacterPopularity2v2').getContext('2d');
    const cercleStat2 = new Chart(ctxCercleStat2, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: totalPlayer2v2,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: 'black'
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });

    $('#datatable1v1').DataTable({
        destroy: true,
        data: data.charactersList,
        pageLength: 50,
        order: [ 2, 'asc' ],
        columnDefs: [
            { type: null, sorting: false, targets: 0 },
            { type: 'string', targets: 1 },
            { type: 'formatted-num', targets: 2 },
            { type: 'formatted-num', targets: 3 }
          ],
        columns: [                  
            { 
                'data': 'img',
                'render': (data,type,row,meta) => {
                    return '<div style="background-color:'+row.color+'; height:1em; width:3em; border:1px white;"></div>';
                }
            },
            { 
                'data': 'combatants',
                'render': (data,type,row,meta) => {
                    return row.name.replace('_', ' ').replace('_', ' ');
                }
            },
            { 
                'data': 'nbPlayer',
                'render': (data,type,row,meta) => {
                    return '<div class="text-end">' + numberWithSpaces(Number(row.totalPlayer1v1)) + '</div>';
                }
            },
            { 
                'data': '%Player',
                'render': (data,type,row,meta) => {
                    return '<div class="text-end">' + Math.round(Number(row.totalPlayer1v1) / Number(row.globalTotalPlayers1v1) * 10000) / 100 + ' %</div>';
                }
            }
        ],
        initComplete: function() {
            $('#loader').css('display', 'none');
        }
    });

    $('#datatable2v2').DataTable({
        destroy: true,
        data: data.charactersList,
        pageLength: 50,
        order: [ 2, 'asc' ],
        columnDefs: [
            { type: null, sorting: false, targets: 0 },
            { type: 'string', targets: 1 },
            { type: 'formatted-num', targets: 2 },
            { type: 'formatted-num', targets: 3 }
          ],
        columns: [                  
            { 
                'data': 'img',
                'render': (data,type,row,meta) => {
                    return '<div style="background-color:'+row.color+'; height:1em; width:3em; border:1px white;"></div>';
                }
            },
            { 
                'data': 'combatants',
                'render': (data,type,row,meta) => {
                    return row.name.replace('_', ' ').replace('_', ' ');
                }
            },
            { 
                'data': 'nbPlayer',
                'render': (data,type,row,meta) => {
                    return '<div class="text-end">' + numberWithSpaces(Number(row.totalPlayer2v2)) + '</div>';
                }
            },
            { 
                'data': '%Player',
                'render': (data,type,row,meta) => {
                    return '<div class="text-end">' + Math.round(Number(row.totalPlayer2v2) / Number(row.globalTotalPlayers2v2) * 10000) / 100 + ' %</div>';
                }
            }
        ],
        initComplete: function() {
            $('#loader').css('display', 'none');
        }
    });
}

function viewsDataMmrByRank(data, nbData) {
    let htmlCanvasMmrByRank = '<canvas id="canvasCharacterRank1v1" class="w-100 border border-secondary p-2"></canvas>' +
        '<div class="text-center"><button class="btn btn-outline-secondary text-light my-3 json-txt-btnZoom" id="no-zoom-btn"></button></div>' +
        '<canvas id="canvasCharacterRank2v2" class="w-100 border border-secondary p-2"></canvas>';
    $('#MmrByRank').html(htmlCanvasMmrByRank);
    getTextMoredataByLang(userLang);

    var datasetsMmr1v1 = [];
    var datasetsMmr2v2 = [];
    let labels = [];
    let color = [];
    let mmr1v1 = [];
    let mmr2v2 = [];

    for (let i = 0; i < data.charactersList.length; i++) {
        labels.push(data.charactersList[i].name.replace('_', ' ').replace('_', ' '));
        color.push(data.charactersList[i].color);
        mmr1v1.push(data.charactersList[i].leaderboard1v1);
        mmr2v2.push(data.charactersList[i].leaderboard2v2);
        for (let j = (Number(nbData)+1); j < (Number(dataLoadMmrByRank)+1); j++) {
            delete mmr1v1[i][j];
            delete mmr2v2[i][j];
        }
        let objTmp1v1 = {};
        let objTmp2v2 = {};
        
        objTmp1v1.fill = false;
        objTmp1v1.label = labels[i];
        objTmp1v1.data = mmr1v1[i];
        objTmp1v1.borderColor = color[i];
        objTmp1v1.backgroundColor = color[i];
        objTmp1v1.pointRadius = 0.1;
        objTmp1v1.borderWidth = 3;

        objTmp2v2.fill = false;
        objTmp2v2.label = labels[i];
        objTmp2v2.data = mmr2v2[i];
        objTmp2v2.borderColor = color[i];
        objTmp2v2.backgroundColor = color[i];
        objTmp2v2.pointRadius = 0.1;
        objTmp2v2.borderWidth = 3;

        datasetsMmr1v1.push(objTmp1v1);
        datasetsMmr2v2.push(objTmp2v2);
    }

    var textTitle1v1 = '';
    var textTitle2v2 = '';
    if (userLang == 'en') {
        textTitle1v1 = 'Top ' + nbData + ' 1v1 for each character';
        textTitle2v2 = 'Top ' + nbData + ' 2v2 for each character';
    } else if (userLang == 'fr') {
        textTitle1v1 = 'Top ' + nbData + ' 1v1 pour chaque personnage';
        textTitle2v2 = 'Top ' + nbData + ' 2v2 pour chaque personnage';
    } else {
        textTitle1v1 = 'Top ' + nbData + ' 1v1 for each character';
        textTitle2v2 = 'Top ' + nbData + ' 2v2 for each character';
    }

    const ctxCharacterRank1v1 = document.getElementById('canvasCharacterRank1v1').getContext('2d');
    const CharacterRank1v1 = new Chart(ctxCharacterRank1v1, {
        type: 'line',
        data: {
            datasets: datasetsMmr1v1
        },
        options: {
            scales: {
                xAxis: {
                    reverse: true,
                    ticks: { color: 'white' },
                    title: {
                        display: true,
                        text: 'RANK',
                        color: 'white',
                        font: { size: 16 }
                    },
                    grid: {
                        color: 'rgb(20, 20, 20)'
                    }
                },
                yAxis: {
                    ticks: { color: 'white' },
                    title: {
                        display: true,
                        text: 'MMR',
                        color: 'white',
                        font: { size: 16 }
                    },
                    grid: {
                        color: 'rgb(20, 20, 20)'
                    }
                },
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white'
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'y',
                    }
                },
                title: {
                    display: true,
                    color: 'white',
                    text: textTitle1v1,
                    padding: {
                        top: 5,
                        bottom: 10
                    },
                    font: {
                      size: 30
                    }
                }
            }
        }
    });

    const ctxCharacterRank2v2 = document.getElementById('canvasCharacterRank2v2').getContext('2d');
    const CharacterRank2v2 = new Chart(ctxCharacterRank2v2, {
        type: 'line',
        data: {
            datasets: datasetsMmr2v2
        },
        options: {
            scales: {
                xAxis: {
                    reverse: true,
                    ticks: { color: 'white' },
                    title: {
                        display: true,
                        text: 'RANK',
                        color: 'white',
                        font: { size: 16 }
                    },
                    grid: {
                        color: 'rgb(20, 20, 20)'
                    }
                },
                yAxis: {
                    ticks: { color: 'white' },
                    title: {
                        display: true,
                        text: 'MMR',
                        color: 'white',
                        font: { size: 16 }
                    },
                    grid: {
                        color: 'rgb(20, 20, 20)'
                    }
                },
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white'
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'y',
                    }
                },
                title: {
                    display: true,
                    color: 'white',
                    text: textTitle2v2,
                    padding: {
                        top: 5,
                        bottom: 10
                    },
                    font: {
                      size: 30
                    }
                }
            }
        }
    });

    $('#no-zoom-btn').click(function(){
        CharacterRank1v1.resetZoom();
        CharacterRank2v2.resetZoom();
    });
}

function viewsDataTopCharactersPopularityByMmr (data, dataMmr, nbData) {
    let obj1v1 = {};
    let obj2v2 = {};
    for (let i = 0; i < data.charactersList.length; i++) {
        let mmrTmp1v1 = [];
        let mmrTmp2v2 = [];
        for (let j in data.charactersList[i].leaderboard1v1) {
            mmrTmp1v1.push(data.charactersList[i].leaderboard1v1[j]);
        }
        for (let k in data.charactersList[i].leaderboard2v2) {
            mmrTmp2v2.push(data.charactersList[i].leaderboard2v2[k]);
        }
        mmrTmp1v1 = mmrTmp1v1.filter((a) => { return a >= dataMmr.mmr1v1 });
        mmrTmp2v2 = mmrTmp2v2.filter((a) => { return a >= dataMmr.mmr2v2 });
        if (mmrTmp1v1.length > 0) {
            obj1v1[data.charactersList[i].name.replace('_', ' ').replace('_', ' ')] = mmrTmp1v1.length;
        }
        if (mmrTmp2v2.length > 0) {
            obj2v2[data.charactersList[i].name.replace('_', ' ').replace('_', ' ')] = mmrTmp2v2.length;        
        }
    }

    const leaderboard1v1 = Object.entries(obj1v1);
    const leaderboard2v2 = Object.entries(obj2v2);
    leaderboard1v1.sort((a, b) => { return b[1] - a[1]; });
    leaderboard2v2.sort((a, b) => { return b[1] - a[1]; });
    var characters1v1 = [];
    var charactersQuantities1v1 = [];
    var characters2v2 = [];
    var charactersQuantities2v2 = [];
    for (let i = 0; i < leaderboard1v1.length; i++) {
        characters1v1.push(leaderboard1v1[i][0]);
        charactersQuantities1v1.push(leaderboard1v1[i][1]);
    }
    for (let i = 0; i < leaderboard2v2.length; i++) {
        characters2v2.push(leaderboard2v2[i][0]);
        charactersQuantities2v2.push(leaderboard2v2[i][1]);
    }

    let htmlCanvasTopCharactersPopularityByMmr = '<canvas id="canvasTopCharactersPopularityByMmr1v1" class="w-100 border border-secondary p-2 mb-3"></canvas>'+
        '<canvas id="canvasTopCharactersPopularityByMmr2v2" class="w-100 border border-secondary p-2"></canvas>';
    $('#topCharactersPopularityByMmr').html(htmlCanvasTopCharactersPopularityByMmr);

    var bgColor1v1 = [];
    var borderColor1v1 = [];
    for (let i = 0; i < characters1v1.length; i++) {
        for (let j = 0; j < data.charactersList.length; j++) {
            if ((data.charactersList[j].name).replace('_', ' ').replace('_', ' ') == characters1v1[i]) {
                bgColor1v1.push((data.charactersList[j].color).slice(0, -1)+', 0.5)');
                borderColor1v1.push(data.charactersList[j].color);
            }
        }
    }
    var bgColor2v2 = [];
    var borderColor2v2 = [];
    for (let i = 0; i < characters2v2.length; i++) {
        for (let j = 0; j < data.charactersList.length; j++) {
            if ((data.charactersList[j].name).replace('_', ' ').replace('_', ' ') == characters2v2[i]) {
                bgColor2v2.push((data.charactersList[j].color).slice(0, -1)+', 0.5)');
                borderColor2v2.push(data.charactersList[j].color);
            }
        }
    }

    var textTitle;
    if (userLang == 'en') {
        textTitle = 'Character popularity for MMR above top ' + nbData;
    } else if (userLang == 'fr') {
        textTitle = 'Popularité des personnages pour un MMR supérieur au top ' + nbData;
    } else {
        textTitle = 'Character popularity for MMR above top ' + nbData;
    }

    const ctxTopCharactersPopularityByMmr1v1 = document.getElementById('canvasTopCharactersPopularityByMmr1v1').getContext('2d');
    const ChartTopCharactersPopularityByMmr1v1 = new Chart(ctxTopCharactersPopularityByMmr1v1, {
        type: 'bar',
        data: {
            labels: characters1v1,
            datasets: [{
                data: charactersQuantities1v1,
                backgroundColor: bgColor1v1,
                borderColor: borderColor1v1,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                xAxis: {
                    ticks: { color: 'white' }
                },
                yAxis: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        precision: 0
                    },
                    grid: {
                        color: 'rgb(20, 20, 20)'
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    color: 'white',
                    text: textTitle + ' 1v1 ('+dataMmr.mmr1v1+' MMR)',
                    padding: {
                        top: 5,
                        bottom: 10
                    },
                    font: {
                        size: 30
                    }
                }
            }
        }
      });
    const ctxTopCharactersPopularityByMmr2v2 = document.getElementById('canvasTopCharactersPopularityByMmr2v2').getContext('2d');
    const ChartTopCharactersPopularityByMmr2v2 = new Chart(ctxTopCharactersPopularityByMmr2v2, {
        type: 'bar',
        data: {
            labels: characters2v2,
            datasets: [{
                data: charactersQuantities2v2,
                backgroundColor: bgColor2v2,
                borderColor: borderColor2v2,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                xAxis: {
                    ticks: { color: 'white' }
                },
                yAxis: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        precision: 0
                    },
                    grid: {
                        color: 'rgb(20, 20, 20)'
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    color: 'white',
                    text: textTitle + ' 2v2 ('+dataMmr.mmr2v2+' MMR)',
                    padding: {
                        top: 5,
                        bottom: 10
                    },
                    font: {
                        size: 30
                    }
                }
            }
        }
    });
}
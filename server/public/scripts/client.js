console.log('client.js');

$(document).ready(readyNow);



function readyNow() {
    console.log('jquery-3.2.1.js');
    getAllLists();

    $('table').hide();

    //event listeners
    $('main').on('click', '.listDiv', listDivClick);
};

//global variables for functions
var currentTable = { is: 'N/A', columnNames: [], tableData: [] };



function getAllLists() {
    console.log('getAllLists()')
    $.ajax({
        method: 'GET',
        url: '/allLists',
        success: function (response) {
            console.log('response', response);
            $('main').empty();
            for (let listsIndex = 0; listsIndex < response.length; listsIndex++) {
                var listDivToAppend = '';
                listDivToAppend += '<div class = "listDiv"'
                listDivToAppend += 'id = "div' + response[listsIndex].list_name + '"';
                listDivToAppend += 'style="background-color:' + response[listsIndex].list_background_color + '">';
                listDivToAppend += '<h2 class = "listTitle">';
                listDivToAppend += response[listsIndex].list_name;
                listDivToAppend += '</h2>';
                listDivToAppend += '</div>';
                $('main').append(listDivToAppend);
            };//end for loop
            var listDivToAppend = '';
            listDivToAppend += '<div class = "listDiv"';
            listDivToAppend += 'style="background-color:grey">';
            listDivToAppend += '<h2 class = "listTitle">';
            listDivToAppend += 'Create New List';
            listDivToAppend += '</h2>';
            listDivToAppend += '</div>';
            $('main').append(listDivToAppend);
        }//end success 
    });//end ajax
}//end getAllLists()

function listDivClick() {
    currentTable.is = $(this).find($('h2')).text();
    listDivHeight = $(this).height()
    if (listDivHeight == 200) {
        $('.listDiv').animate({
            height: "200px",
            width: "200px"
        });
        //enlarges div to size to see all fields of table
        $(this).animate({
            height: "+=440px",
            width: "+=440px"
        });//end animate
        postCurrentTableForColumns();
        //ajax request to get column names of table
    }
};

function postCurrentTableForColumns() {
    $.ajax({
        method: 'POST',
        url: '/columnNames/currentTable',
        data: currentTable,
        success: function (response) {
            console.log(response);
            getColumnNames();
        }
    })
}



function getColumnNames() {
    currentTable.columnNames = [];
    $.ajax({
        method: 'GET',
        url: '/columnNames',
        success: function (response) {
            console.log(response);
            for (let columnNameIndex = 0; columnNameIndex < response.length; columnNameIndex++) {
                currentTable.columnNames.push(response[columnNameIndex].column_name);
            }
            postCurrentTableForList();
        }
    })
}



function postCurrentTableForList() {
    $.ajax({
        method: 'POST',
        url: '/list/currentTable',
        data: currentTable,
        success: function (response) {
            console.log(response);
            getTableData()
        }
    })
}

function getTableData() {
    $.ajax({
        method: 'GET',
        url: '/list',
        success: function (response) {
            console.log(response);
            currentTable.tableData = response
            appendTableTooListDiv();
        }
    })
}

function appendTableTooListDiv() {
    var table = '<table id = "table' + currentTable.is + '"></table>'
    var thead = '<thead id = "thead' + currentTable.is + '"></thead>'
    var tbody = '<tbody id = "tbody' + currentTable.is + '"></tbody>'
    $('#div' + currentTable.is).append(table);
    $('#table' + currentTable.is).append(thead);
    $('#table' + currentTable.is).append(tbody);
    theadtr= '<tr id = "theadtr'+currentTable.is+'">'+'</tr>';
    $('#thead' + currentTable.is).append(theadtr)
    for (let thIndex = 1; thIndex < currentTable.columnNames.length; thIndex++) {
        var theadAppendItem = '';
        theadAppendItem += '<th>' + currentTable.columnNames[thIndex] + '</th>'
        $('#theadtr'+currentTable.is).append(theadAppendItem);
    };
    for (let trIndex = 0; trIndex < currentTable.tableData.length; trIndex++) {
        var tbodyAppendItem = '';
        tbodyAppendItem += '<tr id = "tr' + currentTable.is + currentTable.tableData[trIndex].id + '"></tr>';
        $('#tbody'+currentTable.is).append(tbodyAppendItem);
        for (let columnNameIndex = 1; columnNameIndex < currentTable.columnNames.length; columnNameIndex++) {
            var currentColumn = currentTable.columnNames[columnNameIndex];
            console.log(currentColumn);
            var trAppendItem = '';
            trAppendItem += '<td>' + currentTable.tableData[trIndex].currentColumn + '</td>'
            $('#tr' + currentTable.is + currentTable.tableData[trIndex].id).append(trAppendItem);
        }

    }
}
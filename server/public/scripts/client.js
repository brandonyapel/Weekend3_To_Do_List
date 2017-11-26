console.log('client.js');

$(document).ready(readyNow);



function readyNow() {
    console.log('jquery-3.2.1.js');
    getAllLists();

    $('table').hide();

    //event listeners
    $('main').on('click', '.listDiv', listDivClick);
    $('main').on('click', '.deleteListItem', deleteListItem);
    $('main').on('click', '.addListItemButton', addListItem);
    $('main').on('click', '.insertListItem', insertListItem);
    $('main').on('click', '.cancelListItem', cancelListItem);
    $('main').on('click', '.submitChecks', submitChecks)
};

//global variables for functions
var currentTable = { is: '', columnNames: [], tableData: [], newItem: [] };
var checkbox;
var deleteButton;



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
    listDivHeight = $(this).height()
    if (listDivHeight == 200) {
        refreshBoxes();
        currentTable.is = $(this).find($('h2')).text();
        $('.listDiv').animate({
            height: "200px",
            width: "200px"
        });
        //enlarges div to size to see all fields of table
        $(this).animate({
            height: "+=440px",
            width: "+=440px"
        });//end animate
        refreshBoxes
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
    refreshBoxes();
    var table = '<table id = "table' + currentTable.is + '"></table>'
    var thead = '<thead id = "thead' + currentTable.is + '"></thead>'
    var tbody = '<tbody id = "tbody' + currentTable.is + '"></tbody>'
    $('#div' + currentTable.is).append(table);
    $('#table' + currentTable.is).append(thead);
    $('#table' + currentTable.is).append(tbody);
    theadtr = '<tr id = "theadtr' + currentTable.is + '">' + '</tr>';
    $('#thead' + currentTable.is).append(theadtr)
    $('#theadtr' + currentTable.is).append('<th>✓</th>');
    for (let thIndex = 2; thIndex < currentTable.columnNames.length; thIndex++) {
        var theadAppendItem = '';
        theadAppendItem += '<th>' + currentTable.columnNames[thIndex] + '</th>'
        $('#theadtr' + currentTable.is).append('<th>' + currentTable.columnNames[thIndex] + '</th>');
    };
    $('#theadtr' + currentTable.is).append('<th>x</th>');
    for (let trIndex = 0; trIndex < currentTable.tableData.length; trIndex++) {
        var tbodyAppendItem = '';
        tbodyAppendItem += '<tr id = "tr' + currentTable.is + currentTable.tableData[trIndex].id + '"></tr>';
        $('#tbody' + currentTable.is).append(tbodyAppendItem);
        checkbox = '<td><input class = "checkBox" id="checkBox' + currentTable.is + currentTable.tableData[trIndex].id + '" type="checkbox"></td>'
        $('#tr' + currentTable.is + currentTable.tableData[trIndex].id).append(checkbox)
        for (let columnNameIndex = 2; columnNameIndex < currentTable.columnNames.length; columnNameIndex++) {
            var currentColumn = currentTable.columnNames[columnNameIndex];
            console.log(currentColumn);
            var trAppendItem = '';
            trAppendItem += '<td>' + currentTable.tableData[trIndex][currentColumn] + '</td>'
            $('#tr' + currentTable.is + currentTable.tableData[trIndex].id).append(trAppendItem);
        }
        deleteButton = '<td><button data-id=' + currentTable.tableData[trIndex].id + ' class="deleteListItem" id=delete' + currentTable.is + currentTable.tableData[trIndex].id + '>x</button></td>'
        $('#tr' + currentTable.is + currentTable.tableData[trIndex].id).append(deleteButton);
    }
    //apend table footer
    var columnSpan = currentTable.columnNames.length;
    var tableFooter = ''
    tableFooter += '<tfoot>';
    tableFooter += '<tr>';
    tableFooter += '<td colspan="' + columnSpan + '">';
    tableFooter += '<button class = "addListItemButton" id = "addItem' + currentTable.is + '">add to list</button>'
    tableFooter += '<button class = "submitChecks">submit checks</button>';
    tableFooter += '<button>delete list</button>';
    tableFooter += '<button>minimize list</button></td>';
    tableFooter += '</tr>';
    tableFooter += '<tfoot>';
    $('#table' + currentTable.is).append(tableFooter);
};

function refreshBoxes() {
    $('#table' + currentTable.is).remove();
};

function deleteListItem() {
    console.log($(this).data());
    var listItemToRemove = $(this).data().id;
    console.log('deleteListItem was clicked! The list item id was', listItemToRemove);

    $.ajax({
        method: 'DELETE',
        url: '/list/' + listItemToRemove,
        success: function (response) {
            refreshBoxes();
            getTableData();
        }
    });
}

function addListItem() {
    $('tfoot').remove()
    var colspan = currentTable.columnNames.length;
    var addListAppendItem = '';
    addListAppendItem += '<tr>'
    addListAppendItem += '<td colspan = "' + colspan + '">'
    addListAppendItem += 'Add new item below'
    addListAppendItem += '</td>'
    addListAppendItem += '</tr>'
    addListAppendItem += '<tr>'
    addListAppendItem += '<td>'
    addListAppendItem += '<button class = "insertListItem" id = "+' + currentTable.is + '">+</button>';
    addListAppendItem += '</td>'
    for (let colIndex = 2; colIndex < colspan; colIndex++) {
        addListAppendItem += '<td>';
        addListAppendItem += '<input ';
        addListAppendItem += 'id = "input' + currentTable.is + colIndex + '"';
        addListAppendItem += 'type="text"';
        addListAppendItem += ' placeholder="' + currentTable.columnNames[colIndex] + '"';
        addListAppendItem += 'data-index="' + colIndex + '"';
        addListAppendItem += '>'//endinput
        addListAppendItem += '</td>';
    }
    addListAppendItem += '<td>'
    addListAppendItem += '<button class = "cancelListItem"';
    addListAppendItem += ' id = "cancel+' + currentTable.is + '">x</button>';
    addListAppendItem += '</td>'
    addListAppendItem += '</tr>'
    $('#tbody' + currentTable.is).append(addListAppendItem)
};

function insertListItem() {
    console.log('insertListItem()');
    numberOfInputs = currentTable.columnNames.length
    currentTable.newItem = [];
    for (let inputIndex = 2; inputIndex < currentTable.columnNames.length; inputIndex++) {
        var $currentInput = '#input'+currentTable.is+inputIndex;
        currentTable.newItem.push($($currentInput).val());
    }
    console.log(currentTable.newItem)
    $.ajax({
        method: 'POST',
        url: '/list',
        data: currentTable,
        success: function (response) {
            console.log('response', response);
            getTableData();
        }
    });
}


function cancelListItem () {
    refreshBoxes();
    getTableData();
};

function submitChecks () {
    console.log('submitChecks()');

};
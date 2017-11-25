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
var currentTable = {is: 'N/A'}
var currentTableColumnNames = []


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
                listDivToAppend += '<div class = "listDiv"';
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
        postCurrentTable();
        //ajax request to get column names of table
    }
};

function postCurrentTable () {
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



function getColumnNames () {
    currentTableColumnNames = [];
    $.ajax({
        method: 'GET',
        url: '/columnNames',
        success: function (response) {
            console.log(response);
            currentTable.columnNames = response;
        }
    })
}

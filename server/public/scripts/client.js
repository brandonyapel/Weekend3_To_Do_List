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
    $('main').on('click', '#createNewList', createNewList);
    $('main').on('click', '#submitNewList', submitNewList);
    $('main').on('click', '.deleteList', deleteList);
};

//global variables for functions
var currentTable = { is: '', columnNames: [], tableData: [], newItem: [] };
var checkbox;
var deleteButton;
var lineItem = { completionStatus: '' };
var newList = {list_name: '',list_background_color: ''};
var allLists = [];



function getAllLists() {
    $('main').empty();
    console.log('getAllLists()')
    $.ajax({
        method: 'GET',
        url: '/allLists',
        success: function (response) {
            allLists = response;
            console.log('response', response);
            $('main').empty();
            for (let listsIndex = 0; listsIndex < response.length; listsIndex++) {
                var listDivToAppend = '';
                listDivToAppend += '<div class = "listDiv"'
                listDivToAppend += 'data-id ="' + response[listsIndex].id + '" ';
                listDivToAppend += 'data-name ="' + response[listsIndex].list_name + '" ';
                listDivToAppend += 'id = "div' + response[listsIndex].list_name + '" ';
                listDivToAppend += 'style="background-color:' + response[listsIndex].list_background_color + '">';
                listDivToAppend += '<h2 class = "listTitle">';
                listDivToAppend += response[listsIndex].list_name;
                listDivToAppend += '</h2>';
                listDivToAppend += '</div>';
                $('main').append(listDivToAppend);
            };//end for loop
            var listDivToAppend = '';
            listDivToAppend += '<div class = "createNewListDiv" id = "createNewList"';
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
    resetCreateDiv()
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
        tbodyAppendItem += '<tr data-index="' + trIndex + '" id = "tr' + currentTable.is + currentTable.tableData[trIndex].id + '"></tr>';
        $('#tbody' + currentTable.is).append(tbodyAppendItem);
        if (currentTable.tableData[trIndex].completion_status == 'n') {
            checkbox = '<td><input data-id="' + currentTable.tableData[trIndex].id + '" class = "checkBox" id="checkBox' + currentTable.is + currentTable.tableData[trIndex].id + '" type="checkbox"></td>'
        } else if (currentTable.tableData[trIndex].completion_status == 'y') {
            checkbox = '<td><input checked data-id="' + currentTable.tableData[trIndex].id + '" class = "checkBox" id="checkBox' + currentTable.is + currentTable.tableData[trIndex].id + '" type="checkbox"></td>'
        }
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
    tableFooter += '<button class = "deleteList">delete list</button>';
    tableFooter += '</td>';
    tableFooter += '</tr>';
    tableFooter += '<tfoot>';
    $('#table' + currentTable.is).append(tableFooter);
    completionCSS();
    submitChecks();
};

function refreshBoxes() {
    $('#table' + currentTable.is).remove();
};

function deleteListItem() {
    if (confirm('Are you sure you want to delete this Item') == true) {
        console.log($(this).data());
        var listItemToRemove = $(this).data().id;
        console.log('deleteListItem was clicked! The list item id was', listItemToRemove);
        $(this).closest('tr').fadeOut(1000)
        setTimeOut(function () {
            $.ajax({
                method: 'DELETE',
                url: '/list/' + listItemToRemove,
                success: function (response) {
                    refreshBoxes();
                    getTableData();
                }
            })
        }
            , 1000);
    }
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
        var $currentInput = '#input' + currentTable.is + inputIndex;
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


function cancelListItem() {
    refreshBoxes();
    getTableData();
};

function submitChecks() {

    $('input[type="checkbox"]').click(function () {
        if ($(this).is(":checked")) {
            alert("Checkbox is checked.");
            console.log($(this).data());
            var itemIDToCheck = $(this).data().id;
            console.log('Check Box Checked! The item id was', itemIDToCheck);
            lineItem.completionStatus = 'y'
            $.ajax({
                method: 'PUT',
                url: '/list/' + itemIDToCheck,
                data: lineItem,
                success: function (response) {
                    cancelListItem();
                }
            })

        }
        else if ($(this).is(":not(:checked)")) {
            alert("Checkbox is unchecked.");
            console.log($(this).data());
            var itemIDToCheck = $(this).data().id;
            console.log('Check Box Checked! The item id was', itemIDToCheck);
            lineItem.completionStatus = 'n'
            $.ajax({
                method: 'PUT',
                url: '/list/' + itemIDToCheck,
                data: lineItem,
                success: function (response) {
                    cancelListItem();
                }
            })
        }
    });
};

function completionCSS() {
    for (let completionIndex = 0; completionIndex < currentTable.tableData.length; completionIndex++) {
        if (currentTable.tableData[completionIndex].completion_status == 'y') {
            $('#tr' + currentTable.is + currentTable.tableData[completionIndex].id).css('color', 'green');
            $('#tr' + currentTable.is + currentTable.tableData[completionIndex].id).css('background-color', 'lightgreen');
        }

    }
}

function pastDueCSS() {
    for (let pastDueIndex = 0; pastDueIndex < currentTable.tableData.length; pastDueIndex++) {
        if (currentTable.tableData[pastDueIndex].due_date < Date()) {
            $('#tr' + currentTable.is + currentTable.tableData[pastDueIndex].id).css('color', 'red');
            $('#tr' + currentTable.is + currentTable.tableData[pastDueIndex].id).css('background-color', 'lightred');
        }

    }
};

function createNewList() {
    var createDivHeight = $(this).height()
    if (createDivHeight == 200) {
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
        var CSS_COLOR_NAMES = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
        console.log(CSS_COLOR_NAMES.length)
        var createNewListForm = '';
        createNewListForm += '<h4>List Name:</h4>';
        createNewListForm += '<input id=inputNewList type="text" placeholder="New List Name">'
        createNewListForm +='<p>*lowercase, no spaces, no special characters</p>'
        createNewListForm += '<br>'
        createNewListForm += '<h4>List Color:</h4>';
        createNewListForm += '<select id="selectColor">'
        for (let colorIndex = 0; colorIndex < CSS_COLOR_NAMES.length; colorIndex++) {
            createNewListForm += '<option value="' + CSS_COLOR_NAMES[colorIndex] + '">' + CSS_COLOR_NAMES[colorIndex] + '</option>'
        }
        createNewListForm += '</select>'
        createNewListForm += '<br><br>'
        createNewListForm += '<button id="submitNewList">Create New List</button>';

        $(this).append(createNewListForm);

    }

}


function submitNewList() {
    newList.list_name = $('#inputNewList').val();
    newList.list_background_color = $('#selectColor').val()
    console.log(newList);
    $.ajax({
        method: 'POST',
        url: '/allLists',
        data: newList,
        success: function (response) {
            console.log('response', response);
            $.ajax({
                method: 'POST',
                url: '/allLists/create',
                data: newList,
                success: function (response) {
                    console.log('response', response);
                    getAllLists();
                }
            });
        }
    });
    
}

function resetCreateDiv() {
    $('#inputNewList').remove();
    $('#selectColor').remove();
    $('#submitNewList').remove()

    $('#createNewList').animate({
        height: "200px",
        width: "200px"
    });
}

function  deleteList() {
    var div = $(this).closest('div');
    console.log(div);    
    var listToDelete = div.data().id;
    var nameToDelete= {name: ''}
    nameToDelete.name = div.data().name
    console.log('deletList() the listToDelete was', listToDelete,nameToDelete.name) ;

    $.ajax({
        method: 'DELETE',
        url: '/allLists/' + listToDelete,
        success: function(response) {
            $.ajax({
                method: 'DELETE',
                url: '/columnNames/'+listToDelete,
                data: nameToDelete,
                success: function(response) {
                    getAllLists()
                }
            });
        }
    });
}
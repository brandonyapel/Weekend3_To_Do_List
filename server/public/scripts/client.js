console.log('client.js');

$(document).ready(readyNow);



function readyNow (){
    console.log('jquery-3.2.1.js');

    $('table').hide();

    //event listeners
    $('.listDiv').on('click',listDivClick);
};

function listDivClick (){
    //shows hidden table in div
    $(this).children().show()
    //enlarges div to size to see all fields of table
    $(this).animate({
        height: "+=400px",
        width: "+=400px"});//end animate
    
}
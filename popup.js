/**
 * Created by Jason on 8/19/2016.
 */

/*
TO-DO:
-Sections
-Link to DL
-Option to remove
-Forward/Backward a day
 */

//Get weekday
var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var date = new Date();
var day = weekdays[date.getDay()];

//Header of the popup
function getFullWeekdayName(){
    var weekDay = "<h1 id='title'>"
        + day
        + " (" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")"
        + "</h1>";
    return weekDay;
}

function getPreviousDay(){

}

function getNextDay(){

}

function seasonLabel(todaysShow){
    var seasonName = "(";
    if (todaysShow.season < 10){
        seasonName += "S0" + todaysShow.season;
    }
    else {
        seasonName += "S" +todaysShow.season;
    }

    if (todaysShow.episode < 10){
        seasonName += "E0" + todaysShow.episode;
    }
    else {
        seasonName += "E" + todaysShow.episode;
    }

    seasonName += ")";
    return seasonName;

}


function getFullWeekdayName(){
    var weekDay = "<h1 id='title'>"
        + day
        + " (" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")"
        + "</h1>";
    return weekDay;
}

function loadShow(){
    var table = $('<table>');
    var nothing = $("<p>");


    chrome.storage.sync.get("schedule", (function(results) {

        if (typeof results.schedule == "undefined"){
            console.log("is it empty?:", typeof results.schedule == "undefined");
            table.append($("<tr id='nothingRow'>" +
                "<th>" + "You have nothing listed" + "</th>" +
            "</tr>"));
        }
        else {
            console.log("??");
            var todaysShow = results.schedule[date.getDay()];
            //if there's nothing in today's schedule
            table.append($("<tr id='categoryRow'>" +
                "<th>" + "List of Shows" + "</th>" +
                "<th>" + "link" + "</th>" +
                "</tr>"));
            console.log("week schedule: ", results)
            console.log("todays schedule:", todaysShow);
            console.log("todays show total length: ", todaysShow.length);


            for (i = 0; i < todaysShow.length; i++) {
                table.append($("<tr class='showRow'>" +
                    "<td>" + todaysShow[i].nameOfShow + " " + seasonLabel(todaysShow[i]) + "</td>"
                    + "</tr>"));
            }
        }
    }));

    console.log(table);
    return table;
}


function writeDay() {
    $('#day').empty();
    $('#day').append(getFullWeekdayName());
    console.log(getFullWeekdayName());
    $('#day').append(loadShow());

}


document.addEventListener('DOMContentLoaded', function () {
    writeDay();
});


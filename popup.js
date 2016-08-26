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

    //Get schedule from storage; use null to check if key exists.
    chrome.storage.sync.get(null, (function(results) {
        //if schedule doesn't exist, then output "You have nothing listed"
        var allKeys = Object.keys(results);
        if (allKeys.length == 0 || results.schedule[date.getDay()].length == 0){
            console.log("is it empty / results = object???:", typeof results == "object");
            table.append($("<tr id='nothingRow'>" +
                "<th>" + "You have nothing listed" + "</th>" +
            "</tr>"));
        }
        else {
            //otherwise, retrieve all the show inside the array belonging to today's date
            //and create a table.
            console.log("??");
            var todaysShow = results.schedule[date.getDay()];
            console.log("day ###", date.getDay());
            //if there's nothing in today's schedule
            table.append($("<tr id='categoryRow'>" +
                "<th>" + "List of Shows" + "</th>" +
                "<th>" + "link" + "</th>" +
                "<th>" + "Options" + "</th>" +
                "</tr>"));
            //for debugging
            console.log("week schedule: ", results)
            console.log("todays schedule:", todaysShow);
            console.log("todays show total length: ", todaysShow.length);

            //this writes in the show's season and episodes next to the show in the table
            for (i = 0; i < todaysShow.length; i++) {
                table.append($("<tr class='showRow'>" +
                    "<td>" + todaysShow[i].nameOfShow + " " + seasonLabel(todaysShow[i]) + "</td>" +
                    "<td>" + "<a href='# class='deleteShow'>" + "TODO" + "</a></td>" +
                    //    <button class="submit">Save</button>
                    //var submitButton = document.querySelector('button.submit');
                    //submitButton.addEventListener('click', saveShow);

                // "<td>" + "<a href='#'" + "class='" + todaysShow[i].day + "' id='" + i + "'>(-)</a></td>" +
// empty statement:
                    "<td>" + "<a href='#' id='" + "deleteShow" + i + todaysShow[i].day + "'>(-)</a></td>" +
                    "</tr>"));
                    console.log("deleteShow" + i);
            }
        }
    }));

    console.log(table);
    return table;
}

function convertDayToNumber(day){
    var result;
    var sunday = /^sunday/i,
        monday = /^monday/i,
        tuesday = /^tuesday/i,
        wednesday = /^wednesday/i,
        thursday = /^thursday/i,
        friday = /^friday/i,
        saturday = /^saturday/i;

    switch (true){
        case sunday.test(day): result = "0"; break;
        case monday.test(day): result = "1"; break;
        case tuesday.test(day): result = "2"; break;
        case wednesday.test(day): result = "3"; break;
        case thursday.test(day): result = "4"; break;
        case friday.test(day): result = "5"; break;
        case saturday.test(day): result = "6"; break;
        default: console.log("no such day!");
            result = false;
    }
    return result;

}



$(document).ready(function() {
    $("a").click(function (event) {
        var showID = (event.target.id);
        var check = "deleteShow";
        if (showID.indexOf(check) !== 1){
            var orderNum = showID.substring(10, 11);
            console.log(orderNum);
            var weekday = showID.substring(11);
            console.log(weekday);
            var day = convertDayToNumber(weekday);
            console.log("line 152", day);
            removeShow(day, orderNum);
        }
        // alert(event.target.id);
    });
});



//to remove show, you'll need the Day and the order number. Note: Order # starts from 0.
//For example, On Wednesday, you'd have Suits, Scream Queen, OUAT.
//You would pass in Wednesday, and #2 to remove Scream Queen.

//try name??
function removeShow(day, orderNum){
    chrome.storage.sync.get("schedule", (function(results){
        var todaysShow = results.schedule[day];
        console.log("results.schedule (should be same as weekDay)", results.schedule);
        console.log("before removing: ",todaysShow);
        todaysShow.splice(orderNum, 1);
        console.log("After removing: ", todaysShow);
        chrome.storage.sync.set({"schedule": results.schedule}, function() {
            // Notify that we saved.
            console.log('Settings saved');

        });
    }));
    window.location.reload();
    writeDay();
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


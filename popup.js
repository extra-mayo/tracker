/**
 * Created by Jason on 8/19/2016.
 */

/*
 TO-DO:
 **! need to increment episode count, find total episode count, etc !**
 -Sections (to be implemented)
 -Link to DL (to be implemented: will be needing https://www.themoviedb.org/documentation/api)
 -Option to move shows up / down
 -Option to remove [check]
 -Forward/Backward a day [check]
 */

//Initiated an array filled with 7 arrays that corresponds to each days of the week.
var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var date = new Date();
var day = weekdays[date.getDay()];

/*
    Function that returns the header (or the date) of the popup.
    EX: Saturday (8/27/2016)
 */
function getFullWeekdayName(){
    var weekDay = "<h1 id='title'>"
        + day
        + " (" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")"
        + "</h1>";
    return weekDay;
}

/*
    Function that returns string containing the season and the episode of the show in this format: (SxxExx)
 */
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

/*
    Returns a table that contains show's information, link, and options.
 */
function loadShow(){
    var table = $('<table>');

    //Get schedule from storage; use null to retrieve all the keys and check if specific key exists.
    chrome.storage.sync.get(null, (function(results) {
        //if schedule doesn't exist or if there aren't any shows in a given day, then output "You have nothing listed" into table content.
        var allKeys = Object.keys(results);
        if (allKeys.length == 0 || results.schedule[date.getDay()].length == 0){
            console.log("is it empty / results = object???:", typeof results == "object");
            table.append($("<tr id='nothingRow'>" +
                "<th>" + "You have nothing listed" + "</th>" +
                "</tr>"));
        }
        else {
            //otherwise, retrieve all the shows inside the array belonging to today's date and create a table with info.
            console.log("??");
            var todaysShow = results.schedule[date.getDay()];
            console.log("day ###", date.getDay());
            //if there's nothing in today's schedule
            table.append($("<tr id='categoryRow'>" +
                "<th>" + "Shows" + "</th>" +
                "<th>" + "Link" + "</th>" +
                "<th>" + "Options" + "</th>" +
                "</tr>"));
            //for debugging
            console.log("week schedule: ", results)
            console.log("todays schedule:", todaysShow);
            console.log("todays show total length: ", todaysShow.length);

            //this writes in the show's season and episodes next to the show's name in the table; EX: Suits (S01E01)
            for (i = 0; i < todaysShow.length; i++) {
                table.append($("<tr class='showRow'>" +
                    "<td>" + todaysShow[i].nameOfShow + " " + seasonLabel(todaysShow[i]) + "</td>" +
                    "<td>" + "<button class='link' id='" + "IMDb" + todaysShow[i].nameOfShow +"'>IMDb</button></td>" +
                    "<td>" + "<button class='optionButton' id='" + "deleteShow" + i + todaysShow[i].day + "'>delete</button> " +
                    "<button class='optionButton' id='" + "moveUp" + i + todaysShow[i].day + "'>↑</button> " +
                   "<button class='optionButton' id='" + "moveDown" + i + todaysShow[i].day + "'>↓</button> " +
                    "<button class='optionButton' id='" + "edit" + i + todaysShow[i].day + "'>edit</button></td>" +
                    "</tr>"));
            }
        }
    }));

    console.log(table);
    return table;
}

/*
    Returns the number associated with days.
    Sundays starts with 0 with Saturday being 6.
 */
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

/*
    to remove show, you'll need the Day and the order number. Note: order # starts from 0.
    For example, On Wednesday, you'd have Suits, Scream Queen, OUAT.
You would pass in Wednesday, and #2 to remove Scream Queen.

*/
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
}

function moveShowUp(day, orderNum){
    chrome.storage.sync.get("schedule", (function(results){
        var todaysShow = results.schedule[day];
        console.log("todays Show", todaysShow);
        if (orderNum == 0){
            return;
        }
        else {
            var top = todaysShow[orderNum];
            todaysShow[orderNum] = todaysShow[orderNum-1];
            todaysShow[orderNum-1] = top;
        }
        console.log("After removing: ", todaysShow);
        chrome.storage.sync.set({"schedule": results.schedule}, function() {
            // Notify that we saved.
            console.log('Settings saved');
        });
    }));
    window.location.reload();
}

function moveShowDown(day, orderNum){
    chrome.storage.sync.get("schedule", (function(results){
        var todaysShow = results.schedule[day];
        console.log("todays Show", todaysShow);
        if (orderNum == todaysShow.length-1){
            return;
        }
        else {
            var bottom = todaysShow[orderNum];
            todaysShow[orderNum] = todaysShow[Number(orderNum)+1];
            todaysShow[Number(orderNum)+1] = bottom;
        }
        console.log("After removing: ", todaysShow);
        chrome.storage.sync.set({"schedule": results.schedule}, function() {
            // Notify that we saved.
            console.log('Settings saved');
        });
    }));
    window.location.reload();
}

function writeDay() {
    $('#day').empty();
    $('#day').append(getFullWeekdayName());
    console.log(getFullWeekdayName());
    $('#day').append(loadShow());

}


function getIMDB(nameOfShow){
    $.getJSON('http://omdbapi.com/?s=' + encodeURI(nameOfShow)).then(function(searchResult){
            console.log("search result",searchResult.Search.imdbID);
            var showID = searchResult.Search[0].imdbID;
            var imdbLink = 'http://www.imdb.com/title/' + showID;
            chrome.tabs.create({"url": imdbLink});
        });

//todaysShow[orderNum].nameOfShow


    //http://api.themoviedb.org/3/tv/37680/external_ids?id=37680&api_key=d36b5dfe48c8495b015dda1089770746
    //
    // $.getJSON('http://api.themoviedb.org/3/tv/' + showID + '/external_ids?api_key=d36b5dfe48c8495b015dda1089770746').then(function(showResult){
    //     imdbID = showResult.imdb_id;
    // });

    // var imdbLink = 'http://www.imdb.com/title/' + imdbID;
    // return imdbLink;
}

/*
EDIT function: option to change all the properties of the show
 */


//Writes in the popup content when document is loaded.
$(function(){
    writeDay();
    $("#home").click(function(){
        var newDate = new Date();
        day = weekdays[newDate.getDay()];
        date.setDate(newDate.getDate());
        // date.getMonth() + 1
        date.setMonth(newDate.getMonth());
        console.log(date);
        writeDay();
    });

    $("#prev").click(function(){
        if (date.getDay() - 1 < 0){
            day = weekdays[6];
        }
        else{
            day = weekdays[date.getDay() - 1];
        }
        date.setDate(date.getDate()-1);
        console.log(date);
        writeDay();
    });

    $("#next").click(function(){
        if (date.getDay() + 1 > 6){
            day = weekdays[0];
        }
        else{
            day = weekdays[date.getDay() + 1];
        }
        date.setDate(date.getDate()+1);
        console.log(date);
        writeDay();
    });

    $("#edit").click(function(){

        //display page?
    });

    //delete show when delete button is clicked
    //simply put:
    //use .on to look for elements on current state of page
    //whereas the .click looks for elements on initial page
    $(document).on("click", ".optionButton",(function (event) {
        var showID = (event.target.id);
        var deleteShow = "deleteShow";
        var moveUp = "moveUp";
        var moveDown = "moveDown";
        if (showID.indexOf(deleteShow) == 0){
            var orderNum = showID.substring(10, 11);
            console.log(orderNum);
            var weekday = showID.substring(11);
            console.log(weekday);
            var day = convertDayToNumber(weekday);
            console.log("line 152", day);
            removeShow(day, orderNum);
        }
        else if (showID.indexOf(moveUp) == 0){
            var orderNum = showID.substring(6, 7);
            var weekday = showID.substring(7);
            var day = convertDayToNumber(weekday);
            moveShowUp(day, orderNum);
        }
        else if (showID.indexOf(moveDown) == 0){
            var orderNum = showID.substring(8, 9);
            var weekday = showID.substring(9);
            var day = convertDayToNumber(weekday);
            moveShowDown(day, orderNum);
        }
    }));

    $(document).on("click", ".link", (function(event){
        var event = event.target.id;
        var nameOfShow = event.substring(4);
        getIMDB(nameOfShow);
    }));

});


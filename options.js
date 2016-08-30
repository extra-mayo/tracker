/**
 * Created by Jason on 8/19/2016.
 */

/*
 TO-DO:
 -Add link to DL
 -Remove button???
 */



//initiate new array variables for each weekdays
var Sunday = [],
    Monday = [],
    Tuesday = [],
    Wednesday = [],
    Thursday = [],
    Friday = [],
    Saturday = [];

//store the weekdays into an array
var weekDays = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday];

//store the array of weekdays into chrome storage
chrome.storage.sync.set({"schedule": weekDays}, function() {
        // Notify that we saved.
        console.log("initial empty weekday saved into storage");
   });



function show (show, day, season, episode) {
    this.nameOfShow = show;
    this.day = day;
    if (!season) {
        this.season = "??";
    }
    else {
        this.season = season;
    }
    if (!episode) {
        this.episode = "??"
    }
    else {
        this.episode = episode;
    }
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

function saveShow(){
    //store user's new show (or their input) into variable newShow
    //TO-DO: implement more attributes
    var newShow = new show($('#showName').val(),$('#day').val(), $('#season').val(), $('#episode').val());
    if (!newShow){
        alert("Error: no show or attributes(?) specified");
        return;
    }
    else {
        if (convertDayToNumber(newShow.day) === false){
            console.log("invalid day! (-1)");
        }
        else {
            chrome.storage.sync.get("schedule", (function(results){
                results.schedule[convertDayToNumber(newShow.day)].push(newShow);
                console.log("pushed show into storage", newShow)
                chrome.storage.sync.set({"schedule": results.schedule}, function() {
                    // Notify that we saved.
                    alert('Settings saved');

                });
            }));
        }
    }

}


$(function(){
    $("#submit").click(function(){
        saveShow();
    });
});

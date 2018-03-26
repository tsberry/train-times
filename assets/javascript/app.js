// Initialize Firebase
var config = {
    apiKey: "AIzaSyCXA5uTkpdC7lqCMLKmMPhn3b0vArZG84I",
    authDomain: "train-times-7a0ea.firebaseapp.com",
    databaseURL: "https://train-times-7a0ea.firebaseio.com",
    projectId: "train-times-7a0ea",
    storageBucket: "",
    messagingSenderId: "815431231682"
};
firebase.initializeApp(config);

var database = firebase.database();

var trains;

function Train(n, d, f, fr) {
    this.name = n;
    this.destination = d;
    this.first = f;
    this.freq = fr;
}

function makeRow(train) {
    var row = $("<tr>");
    var nameD = $("<td>");
    nameD.text(train.name);

    var destD = $("<td>");
    destD.text(train.destination);

    var freqD = $("<td>");
    freqD.text(train.freq);

    var nextD = $("<td>");
    nextD.text(parseTime(nextTrain(train)));

    var minD = $("<td>");
    minD.text(minTillNext(train));

    row.append(nameD, destD, freqD, nextD, minD);
    $("#train-table").append(row);
};

function nextTrain(train) {
    var time = train.first.split(":");
    var hrs = parseInt(time[0]);
    var min = parseInt(time[1]);
    min += hrs * 60;

    var curr = new Date();
    var currMin = curr.getMinutes() + curr.getHours() * 60;

    var diff = currMin - min;
    var frequency = parseInt(train.freq);
    var next = currMin + frequency - (diff % frequency);
    return next;
}

function minTillNext(train) {
    var curr = new Date();
    var currMin = curr.getMinutes() + curr.getHours() * 60;
    return nextTrain(train) - currMin;
}

function parseTime(minutes) {
    var text = "";
    var hours = (Math.floor(minutes / 60));
    var min = minutes - (hours * 60);
    text = (hours % 24) + ":";
    if(min < 10) {
        text += "0" + min;
    }
    else {
        text += min;
    }
    return text;
}

database.ref().on("value", function (snapshot) {
    trains = snapshot.val().array;
    $("tbody").empty();
    for (var i = 0; i < trains.length; i++) {
        console.log(trains[i]);
        makeRow(trains[i]);
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#add-train").on("click", function () {
    event.preventDefault();

    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var first = $("#time-input").val().trim();
    var freq = $("#freq-input").val().trim();
    trains.push(new Train(name, destination, first, freq));
    database.ref().set({
        array: trains
    });
});
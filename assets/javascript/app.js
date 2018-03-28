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

var trains = [];

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
    nextD.text(nextTrain(train).format("hh:mm A"));

    var minD = $("<td>");
    minD.text(minTillNext(train));

    row.append(nameD, destD, freqD, nextD, minD);
    $("#train-table").append(row);
}

function modulo(num, denom) {
    if (num % denom >= 0) {
        return Math.abs(num % denom);
    }
    else {
        return num % denom + denom;
    }
}

function nextTrain(train) {
    var next = moment().add(minTillNext(train), "minutes");
    return next;
}

function minTillNext(train) {
    var time = moment(train.first, "HH:mm");
    var diff = moment().startOf("minute").diff(time, "minutes");
    var frequency = parseInt(train.freq);
    return frequency - modulo(diff, frequency);
}

database.ref().on("child_added", function (snapshot) {
    train = snapshot.val().train;
    trains.push(train);
    makeRow(train);
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

setInterval(function () {
    $("tbody").empty();
    for (var i = 0; i < trains.length; i++) {
        makeRow(trains[i]);
    }
}, 60000);

$("#add-train").on("click", function () {
    event.preventDefault();

    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var first = $("#time-input").val().trim();
    var freq = $("#freq-input").val().trim();
    database.ref().push({
        train: new Train(name, destination, first, freq)
    });
});
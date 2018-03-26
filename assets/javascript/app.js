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

    var minD = $("<td>");

    row.append(nameD, destD, freqD, nextD, minD);
    $("#train-table").append(row);
};

var myTrain = new Train("My Train", "Boston", "05:00", "60");
trains.push(myTrain);

database.ref().on("value", function (snapshot) {
    var arr = snapshot.val().array;
    console.log(arr);
    $("#tbody").empty();
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        makeRow(arr[i]);
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
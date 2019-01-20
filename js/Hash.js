var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var size = 0;
var initial_x;
var algorithm = "null";


function selectAlgorithm() {

    var selection = document.getElementById("selectType").value;
    switch (selection) {
        case "simple":
            algorithm = "simpleHashing";
            break;

        case "linear_probing":
            algorithm = "linearProbing";
            break;

        case "quadratic_probing":
            algorithm = "quadraticProbing";
            break;

        case "chaining":
            algorithm = "chaining";
            break;

        default:
            algorithm = "null";

    }
}


function findAlgorithm() {

    switch (algorithm) {
        case "simpleHashing":
            findSimpleHashing();
            break;
        case "linearProbing":
            findLinearProbing();
            break;


        case "quadraticProbing":
            findQuadraticProbing();
            break;

        case "chaining":
            findChaining();
            break;
        default:
    }
}



function executeAlgorithm() {

    switch (algorithm) {
        case "simpleHashing":
            simpleHashing();
            break;

        case "linearProbing":
            linearProbing();
            break;


        case "quadraticProbing":
            quadraticProbing();
            break;

        case "chaining":
            Chaining();
            break;
        default:

    }
}




function validate() {

    document.getElementById("error").innerHTML = "";
    number = document.getElementById("value").value;
    num = Number(number);
    if ((number == "") || (num > 99999) || (num < 0) || (isNaN(num))) { document.getElementById("error").innerHTML = "Please insert a positive integer up to 5-digits"; }
    else { executeAlgorithm(); }

}

function validateFinding() {
    document.getElementById("error").innerHTML = "";
    number = document.getElementById("value").value;
    num = Number(number);
    if ((number == "") || (num > 99999) || (num < 0) || (isNaN(num))) { document.getElementById("error").innerHTML = "Please insert a positive integer up to 5-digits"; }
    else { findAlgorithm(); }
}



function HashTable(size) {
    this._bucketSize = size;
    this._buckets = [];
}


function createTable() {

    selectAlgorithm()

    size = document.getElementById("myRange").value;

    if (algorithm == "null" || (algorithm == "undefined")) { document.getElementById("error").innerHTML = "Please choose an algorithm"; }
    else {

        hash_table = new HashTable(size);
        //Draw the table
        ctx.clearRect(0, 0, c.width, c.height);
        var table_size = size * 50;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#dee2e6";
        initial_x = (1000 - table_size) / 2;

        for (var x = initial_x; x < (initial_x + table_size); x += 50) { ctx.strokeRect(x, 50, 50, 50); }
        //Draw the indexes 
        ctx.font = "20px Arial";
        x = initial_x + 20;
        for (var i = 0; i < size; i += 1) {
            ctx.fillText(i, x, 40);
            x += 50;
        }

        document.getElementById("insert").disabled = false;
        document.getElementById("find").disabled = false;
    }


}

function drawNumber(value, hash, level) {
    startY = level * 50 + (level - 1) * 35 + 35;
    ctx.font = "15px Arial";
    var num_len = value.toString().length;
    startX = (50 - num_len * 9) / 2
    ctx.fillText(value, (initial_x + hash * 50 + startX), startY);

}


function draw_arrow(context, startX, startY, size) {
    var arrowY = startY + 0.75 * size;
    var arrowLeftX = startX - 0.707 * (0.25 * size);
    var arrowRightX = startX + 0.707 * (0.25 * size);
    context.moveTo(startX, startY);
    context.lineTo(startX, startY + size);
    context.lineTo(arrowLeftX, arrowY);
    context.moveTo(startX, startY + size);
    context.lineTo(arrowRightX, arrowY);
    context.stroke();
}
function drawText(text) {
    ctx.font = "20px Arial";
    ctx.fillText(text, 400, 250);


}


function visualiseCollision(value, hash, collisions) {
    for (var i = 0; i < collisions.length; i++) {
        ctx.clearRect(initial_x + collisions[i] * 50, 50, 50, 50);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#dee2e6";
        ctx.strokeRect(initial_x + collisions[i] * 50, 50, 50, 50);
        drawNumber(hash[i], collisions[i], 1);
    }

}


function visualiseFinding(value, hash, level) {
    startY = level * 50 + (level - 1) * 35;
    ctx.clearRect(initial_x + hash * 50, startY, 50, 50);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#dee2e6";
    ctx.strokeRect(initial_x + hash * 50, startY, 50, 50);
    drawNumber(value, hash, level);
}


function visualiseGreen(hash) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "green";
    ctx.strokeRect(initial_x + hash * 50, 50, 50, 50);
    ctx.clearRect(300, 150, 500, 300);
    text = "Element found"
    drawText(text)

}


function simpleHashing() {

    ctx.clearRect(300, 150, 500, 300);
    var value = document.getElementById('value').value;
    var hash = (value % size) % size;
    var text = String(hash) + "=(" + String(value) + "%" + String(size) + ")%" + String(size)
    drawText(text)

    //Store collisions
    var collisions = new Array();
    if (typeof hash_table._buckets[hash] == 'undefined') {
        hash_table._buckets[hash] = value;
        drawNumber(value, hash, 1)
    }

    else {
        collisions.push(hash)
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.clearRect(300, 150, 500, 300);
        text = "Collision occurred"
        drawText(text)

        ctx.strokeRect(initial_x + hash * 50, 50, 50, 50);
        setTimeout(function () { visualiseCollision(value, hash, collisions); }, 700);

    }
}

function findSimpleHashing() {
    var value = document.getElementById('value').value;
    var hash = (value % size) % size;
    var stored_value = hash_table._buckets[hash];

    if (stored_value == value) {
        visualiseGreen(hash)
        setTimeout(function () { visualiseFinding(value, hash, 1); }, 700);
    }

    else {
        text = "Element not found"
        drawText(text)
    }
}


function findChaining() {
    var value = document.getElementById('value').value;

    var hash = (value % size) % size;
    var stored_value = hash_table._buckets[hash];
    console.log(stored_value);
    if (typeof stored_value == undefined) {
        text = "Element not found"
        drawText(text)
    }
    else {
        level = 0;
        for (var i = 0; i < stored_value.length; i++) {
            level = level + 1;
            console.log(level)
            if (stored_value[i] == value) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "green";
                startY = level * 50 + (level - 1) * 35;
                ctx.strokeRect(initial_x + hash * 50, startY, 50, 50);

                text = "Element found"
                ctx.font = "20px Arial";
                ctx.fillText(text, 400, 470);
                setTimeout(function () { visualiseFinding(value, hash, level); }, 700);
            }
        }
    }
}






function Chaining() {
    var value = document.getElementById('value').value;
    var hash = (value % size) % size;
    if (typeof hash_table._buckets[hash] == 'undefined') {
        hash_table._buckets[hash] = new Array();
        hash_table._buckets[hash].push(value);
        drawNumber(value, hash, 1)
    }

    else if (hash_table._buckets[hash].length == 5) {
        var text = "Sorry, we can not proceed further"
        ctx.font = "20px Arial";
        ctx.fillText(text, 400, 470);
    }
    else {
        console.log(typeof hash_table._buckets[hash]);
        hash_table._buckets[hash].push(value);
        var collisions = hash_table._buckets[hash].length
        var startX = initial_x + hash * 50 + 25;
        var startY = 40 + (collisions - 1) * 50 + 35 * (collisions - 2);
        var arrow_size = 45;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#dee2e6";
        draw_arrow(ctx, startX, startY, arrow_size);
        ctx.strokeRect(startX - 25, startY + arrow_size, 50, 50);
        drawNumber(value, hash, collisions)

    }
}



function linearProbing() {
    ctx.clearRect(300, 150, 500, 300);
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var text = String(hash) + "=(" + String(value) + "mod" + String(size) + ")+" + String(prob) + ")mod" + String(size)
    drawText(text)
    var prev_hash = hash;
    console.log(prev_hash);
    var collisions = new Array();
    var values = new Array();


    while (typeof hash_table._buckets[hash] !== 'undefined') {
        stored_value = hash_table._buckets[hash];
        collisions.push(hash);
        values.push(stored_value)
        prob = prob + 1;
        hash = ((value % size) + prob) % size;

        if (prev_hash == hash) {
            ctx.clearRect(300, 150, 500, 300);
            text = "No valid empty positions";
            drawText(text);
            break
        }
    }

    for (var i = 0; i < collisions.length; i++) {
        console.log(typeof collisions[i])
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.strokeRect(initial_x + collisions[i] * 50, 50, 50, 50);
    }
    setTimeout(function () { visualiseCollision(value, values, collisions); }, 200);


    hash_table._buckets[hash] = value;
    console.log("cc")
    console.log(hash_table._buckets[hash]);
    drawNumber(value, hash, 1)
}


function findLinearProbing() {
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var stored_value = hash_table._buckets[hash];
    console.log(stored_value);
    if (typeof stored_value == undefined) {
        text = "Element not found"
        drawText(text)
    }
    else {
        while (stored_value !== value) {
            prob = prob + 1;
            hash = ((value % size) + prob) % size;
            stored_value = hash_table._buckets[hash];
        }
    }

    visualiseGreen(hash)
    setTimeout(function () { visualiseFinding(value, hash, 1); }, 700);
}



function quadraticProbing() {
    ctx.clearRect(300, 150, 500, 300);
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var prev_hash = hash;
    var collisions = new Array();
    var values = new Array();
    var text = String(hash) + "=(" + String(value) + "%" + String(size) + ")+" + String(prob) + ")%" + String(size)
    drawText(text)


    while (typeof hash_table._buckets[hash] !== 'undefined') {
        stored_value = hash_table._buckets[hash];
        collisions.push(hash);
        values.push(stored_value)
        prob = Math.pow((prob + 1), 2);
        hash = ((value % size) + prob) % size;

        if (prev_hash == hash) {
            ctx.clearRect(300, 150, 500, 300);
            text = "No valid empty positions";
            drawText(text);
            break
        }
    }

    for (var i = 0; i < collisions.length; i++) {
        console.log(typeof collisions[i])
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.strokeRect(initial_x + collisions[i] * 50, 50, 50, 50);
    }
    setTimeout(function () { visualiseCollision(value, values, collisions); }, 200);


    hash_table._buckets[hash] = value;
    console.log("cc")
    console.log(hash_table._buckets[hash]);
    drawNumber(value, hash, 1)

}


function findQuadraticProbing() {
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var stored_value = hash_table._buckets[hash];
    console.log(stored_value);
    if (typeof stored_value == undefined) {
        text = "Element not found"
        drawText(text)
    }

    else {
        while (stored_value != value) {
            prob = Math.pow((prob + 1), 2);
            hash = ((value % size) + prob) % size;
            stored_value = hash_table._buckets[hash];
        }
    }

    visualiseGreen(hash)
    setTimeout(function () { visualiseFinding(value, hash, 1); }, 700);
}



window.onload = function () {
}; 

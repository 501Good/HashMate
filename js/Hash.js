var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var size = 0;
var initial_x;


function selectAlgorithm() {

    var selection = document.getElementById("selectType").value;
    console.log(selection)
    if (selection == "simple") {
        document.getElementById("insert").onclick =  simpleHashing;

    }
    else if (selection == "linear_probing") {
        document.getElementById("insert").onclick = linearProbing;

    }


    else if (selection == "quadratic_probing") {
        document.getElementById("insert").onclick = quadraticProbing;

    }

    else if (selection == "chaining") {
        document.getElementById("insert").onclick =  Chaining;

    }


}

function validate() {
    if (document.getElementById("selectType").value == "null") {
        console.log(document.getElementById("selectType").value);
        alert("Please choose a hashing algorithm");
       // document.getElementById("error").innerHTML = "Please choose a hashing algorithm";
    }

    if (hash_table == null) { document.getElementById("error").innerHTML = "Please choose the size of hash table"; }


}


function HashTable(size) {
    this._bucketSize = size;
    this._buckets = [];
}


function createTable() {
    size = document.getElementById("myRange").value;
    console.log(size);
    if (size == 20) { document.getElementById("error").innerHTML = "Please choose the size of hash table"; }
    else {
        hash_table = new HashTable(size);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var table_size = size * 50;
        ctx.lineWidth = 2;

        ctx.strokeStyle = "#dee2e6";
        initial_x = (1000 - table_size) / 2;

        for (var x = initial_x; x < (initial_x + table_size); x += 50) { ctx.strokeRect(x, 50, 50, 50); }

        ctx.font = "20px Arial";
        x = initial_x + 20;
        for (var i = 0; i < size; i += 1) {
            ctx.fillText(i, x, 40);
            x += 50;
        }
    }
}

function drawNumber(value, hash, level) {
    ctx.font = "20px Arial";
    console.log(initial_x);
    ctx.fillText(value, (initial_x + hash * 50 + 20), 85 * level);

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
function drawText(text){
    ctx.font = "20px Arial";
    ctx.fillText(text, 400, 250);


}

function simpleHashing() {
    validate()
    ctx.clearRect(300, 150, 500, 300);
    var value = document.getElementById('value').value;
    var hash = (value % size) % size;
    var text=String(hash)+"=("+String(value)+"%"+String(size)+")%" + String(size)
    drawText(text)

    console.log(hash);
    if (typeof hash_table._buckets[hash] == 'undefined') {
        hash_table._buckets[hash] = value;
        console.log(hash_table._buckets[hash]);
        drawNumber(value, hash, 1)
    }

    else {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.strokeRect(initial_x + hash * 50, 50, 50, 50);
        setTimeout(function () { visualiseCollision(value, hash); }, 700);

    }
}



function visualiseCollision(value, hash) {
console.log("aa")
    ctx.clearRect(initial_x + hash * 50, 50, 50, 50);
    console.log("bb")

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#dee2e6";
    ctx.strokeRect(initial_x + hash * 50, 50, 50, 50);
    drawNumber(value, hash, 1);



}

function Chaining() {
    validate()
    var value = document.getElementById('value').value;
    var hash = (value % size) % size;
    if (typeof hash_table._buckets[hash] == 'undefined') {
        hash_table._buckets[hash] = new Array();
        hash_table._buckets[hash].push(value);
        drawNumber(value, hash, 1)
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

    validate()
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var text=String(hash)+"=("+String(value)+"%"+String(size)+")+"+String(prob)+")%" + String(size)
    drawText(text)
    while (typeof hash_table._buckets[hash] !== 'undefined') {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.strokeRect(initial_x + hash * 50, 50, 50, 50);
        setTimeout(function () { visualiseCollision(value, hash); }, 700);
        prob = prob + 1;
        hash = ((value % size) + prob) % size;
    }
    hash_table._buckets[hash] = value;
    console.log(hash_table._buckets[hash]);
    drawNumber(value, hash, 1)
}

function quadraticProbing() {
    ctx.clearRect(300, 150, 500, 300);

    validate()
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var text=String(hash)+"=("+String(value)+"%"+String(size)+")+"+String(prob)+")%" + String(size)
    drawText(text)
    while (typeof hash_table._buckets[hash] !== 'undefined') {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "red";
        ctx.strokeRect(initial_x + hash * 50, 50, 50, 50);
        setTimeout(function () { visualiseCollision(value, hash); }, 700);
        prob = Math.pow((prob + 1), 2);
        hash = ((value % size) + prob) % size;
        var text=String(hash)+"=("+String(value)+"%"+String(size)+")+"+String(prob)+")%" + String(size)

    }
    hash_table._buckets[hash] = value;
    console.log(hash_table._buckets[hash]);
    drawNumber(value, hash, 1)

}

window.onload = function () {
}; 

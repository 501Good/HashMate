var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var size = 0;
var initial_x;
var FNVPRIME = 0x01000193;
var FNVINIT = 0x811c9dc5;
var seed = Math.floor(Math.random() * 2e32);
var bloomCounter = 1;
var greens = new Set([]);


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

    else if (selection == "bloom") {
        $("#insert").click(function() {
            ctx.clearRect(300, 150, 500, 300);
            var value = document.getElementById('value').value;
            var hash1 = murmurhash3_32_gc(value, seed) % size;
            var hash2 = fnv1s(value) % size;

            ctx.beginPath();
            ctx.rect(initial_x + hash1 * 50, 50, 50, 50);
            ctx.rect(initial_x + hash2 * 50, 50, 50, 50);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'black';

            var desc = "String: " + value + "<br/>Murmur hash: " + hash1 + "<br/>FNV hash: " + hash2;
            $("#description").html(desc);
            if (bloomCounter == 1) {
                $("#bloomTable").append('<thead><tr><th scope="col">#</th><th scope="col">String</th><th scope="col">Murmur</th><th scope="col">FNV</th></tr></thead>');
            }
            $("#bloomTableBody").append('<tr onclick="selectBloom($(this))" class="bloomRow"><th scope="row">' + bloomCounter + '</th><td id="val">' + value + '</td><td id="hash1">' + hash1 + '</td><td id="hash2">' + hash2 + "</td></tr>");
            bloomCounter++;
            greens.add(hash1);
            greens.add(hash2);
        });
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
        if ($("#selectType").val() == "bloom") {
            $("#canvas").css("height", "200");
            $("#canvas").attr("height", "200");
            bloomCounter = 1;
        } else {
            $("#canvas").css("height", "500");
            $("#canvas").attr("height", "500");
        }
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


// http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string/1242596#1242596
function stringToBytes(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);  // get char
        st = [];                 // set up "stack"
        do {
        st.push( ch & 0xFF );  // push byte to stack
        ch = ch >> 8;          // shift value down by 1 byte
        }
        while ( ch );
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat( st.reverse() );
    }
    // return an array of bytes
    return re;
}


function fnv1s(str) {
    var bytes = stringToBytes(str);
    var hash = FNVINIT;
    for (var i=0; i < bytes.length; i++) {
      hash *= FNVPRIME;
      hash ^= bytes[i];
    }
    return Math.abs(hash);
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


function selectBloom(el) {
    console.log(el);
    var hash1 = parseInt(el.find("td#hash1").text());
    var hash2 = parseInt(el.find("td#hash2").text());
    greens.forEach(function(e) {
        if (e != hash1 || e != hash2) {
            ctx.clearRect(initial_x + e * 50, 50, 50, 50); 
            ctx.clearRect(initial_x + e * 50, 50, 50, 50); 
            ctx.beginPath();
            ctx.rect(initial_x + e * 50, 50, 50, 50); 
            ctx.rect(initial_x + e * 50, 50, 50, 50); 
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#dee2e6";
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'black';
        }
    });
    ctx.beginPath();
    ctx.rect(initial_x + hash1 * 50, 50, 50, 50); 
    ctx.rect(initial_x + hash2 * 50, 50, 50, 50); 
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
}


jQuery(document).ready(function($) { 
    $(".table > tbody > tr").click(function() {
        window.location = "hello";
        $(this).addClass("chosen");
        var hash1 = parseInt($("tr.chosen").find("td#hash1.chosen").text());
        var hash2 = parseInt($("tr.chosen").find("td#hash2.chosen").text());
        $("#description").text(hash1 + " " + hash2);
        ctx.beginPath();
        ctx.rect(initial_x + hash1 * 50, 50, 50, 50); 
        ctx.rect(initial_x + hash2 * 50, 50, 50, 50); 
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
    }, function() {
        var hash1 = parseInt($("tr.chosen").find("td#hash1").text());
        var hash2 = parseInt($("tr.chosen").find("td#hash2").text());
        $("#description").text(hash1 + " " + hash2);
        ctx.clearRect(initial_x + hash1 * 50, 50, 50, 50); 
        ctx.clearRect(initial_x + hash2 * 50, 50, 50, 50); 
        ctx.beginPath();
        ctx.rect(initial_x + hash1 * 50, 50, 50, 50); 
        ctx.rect(initial_x + hash2 * 50, 50, 50, 50); 
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#dee2e6";
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
        $(this).removeClass("chosen");
    });
});

window.onload = function () {
}; 

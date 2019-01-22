var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var size = 0;
var initial_x;
var FNVPRIME = 0x01000193;
var FNVINIT = 0x811c9dc5;
var seed = Math.floor(Math.random() * 2e32);
var bloomCounter = 1;
var greens = new Set([]);
var algorithm = "null";


function selectAlgorithm() {

    var selection = document.getElementById("selectType").value;
    switch (selection) {
        case "simple":
            algorithm = "simpleHashing";
            $("#valueLabel").text("Value");
            removeCanvas();
            minimizeCanvas();
            break;

        case "linear_probing":
            algorithm = "linearProbing";
            $("#valueLabel").text("Value");
            removeCanvas();
            minimizeCanvas();
            break;

        case "quadratic_probing":
            algorithm = "quadraticProbing";
            $("#valueLabel").text("Value");
            removeCanvas();
            minimizeCanvas();
            break;

        case "chaining":
            algorithm = "chaining";
            $("#valueLabel").text("Value");
            removeCanvas();
            restoreCanvas();
            break;

        case "bloom":
            algorithm = "bloom";
            $("#valueLabel").text("Value");
            removeCanvas();
            restoreCanvas();
            minimizeCanvas();
            $("#collisionProb").text("False positive probability: 0%");
            break;

        case "universal":
            algorithm = "universal";
            $("#valueLabel").text("Elements");
            $("#find").prop("disabled", true);
            removeCanvas();
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

        case "bloom":
            findBloom();
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

        case "bloom":
            bloom();
            break;

        case "universal":
            $("svg").remove();
            $("#container").append("<svg></svg>");
            var prime = 541;
            var value = parseInt($("#value").val());
            var tableSize = parseInt($("#myRange").val());
            var collisions = {};
            for (var i = 0; i < tableSize; i += 1) {
                collisions[i] = 0;
            }
            var hash = 0;
            for (var i = 0; i < value; i += 1) {
                hash = universalHashing(Math.floor(Math.random() * 2e32), prime, tableSize);
                collisions[hash] += 1;
            }

            var sample = [];

            for (key in collisions) {
                sample.push({
                    number: key,
                    value: collisions[key]
                })
            }

            console.log(sample);

            drawBarChart(sample, tableSize);

        default:

    }
}


function drawBarChart(sample, tableSize) {
    const svg = d3.select('svg');
    const svgContainer = d3.select('#svg-container');

    var maxKey = sample.reduce((max, p) => p.value > max ? p.value : max, sample[0].value);
    console.log(maxKey);

    const margin = 80;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(sample.map((s) => s.number))
        .padding(0.4)
    
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxKey * 1.2]);

    const makeYLines = () => d3.axisLeft()
        .scale(yScale)

    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    chart.append('g')
        .call(d3.axisLeft(yScale));

        chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
          .tickSize(-width, 0, 0)
          .tickFormat('')
        )
  
    const barGroups = chart.selectAll()
    .data(sample)
    .enter()
    .append('g')

    barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.number))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
        .attr('opacity', 0)

        d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (a) => xScale(a.number) - 5)
        .attr('width', xScale.bandwidth() + 10)

        const y = yScale(actual.value)

        line = chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)

    })
    .on('mouseleave', function () {
        d3.selectAll('.value')
        .attr('opacity', 1)

        d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.number))
        .attr('width', xScale.bandwidth())

        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()
    })

    barGroups 
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.number) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) + 30)
    .attr('text-anchor', 'middle')
    
    svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Number of collisions')

    svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Hash bucket')

    svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Number of collisions with the Universal Hashing function')

    svg.append('text')
    .attr('class', 'source')
    .attr('x', width - margin / 2)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'start')
    .text('Source: HashMate, 2019')
}


function validate() {

    document.getElementById("error").innerHTML = "";
    number = document.getElementById("value").value;
    num = Number(number);
    if (algorithm == "bloom") {executeAlgorithm();}
    else if ((number == "") || (num > 99999) || (num < 0) || (isNaN(num))) { document.getElementById("error").innerHTML = "Please insert a positive integer up to 5-digits"; }
    else { executeAlgorithm(); }

}

function validateFinding() {
    document.getElementById("error").innerHTML = "";
    number = document.getElementById("value").value;
    num = Number(number);
    if (algorithm == "bloom") {findAlgorithm();}
    else if ((number == "") || (num > 99999) || (num < 0) || (isNaN(num))) { document.getElementById("error").innerHTML = "Please insert a positive integer up to 5-digits"; }
    else { findAlgorithm(); }
}



function HashTable(size) {
    this._bucketSize = size;
    this._buckets = [];
}


function removeCanvas() {
    $("#canvas").css("height", "0");
    $("#canvas").attr("height", "0");
    $("#canvas").css("width", "0");
    $("#canvas").attr("width", "0");
    $("svg").remove();
    $("#collisionProb").remove();
    $("#container").prepend("<svg></svg>");
    $("#description").empty();
    $("#bloomTable").empty();
}


function restoreCanvas() {
    $("#canvas").css("height", "500");
    $("#canvas").attr("height", "500");
    $("#canvas").css("width", "1000");
    $("#canvas").attr("width", "1000");
    $("#bloomTable").empty();
    $("svg").remove();
    $("#collisionProb").remove();
    greens = new Set([]);
    $("#description").empty();
    $("#bloomTable").empty();
}


function minimizeCanvas() {
    $("#canvas").css("height", "100");
    $("#canvas").attr("height", "100");
    $("#canvas").css("width", "1000");
    $("#canvas").attr("width", "1000");
    bloomCounter = 1;
    $("svg").remove();
    $("#collisionProb").remove();
    $("#container").prepend('<p id="collisionProb"></p>');
    $("#bloomTable").empty();
    greens = new Set([]);
    $("#description").empty();
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
        if (algorithm != "universal") {
            document.getElementById("find").disabled = false;
        }
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

function visualiseCollision(value, hash, collisions) {
    for (var i = 0; i < collisions.length; i++) {
        ctx.clearRect(initial_x + collisions[i] * 50, 50, 50, 50);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#dee2e6";
        ctx.strokeRect(initial_x + collisions[i] * 50, 50, 50, 50);
        drawNumber(hash[i], collisions[i], 1);
    }

}

function visualiseCollisionSimple(value, hash, collision) {
        ctx.clearRect(initial_x + hash * 50, 50, 50, 50);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#dee2e6";
        ctx.strokeRect(initial_x + hash * 50, 50, 50, 50);
        drawNumber(collision, hash, 1);
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
}


function simpleHashing() {

    var input = document.getElementById('value').value;
    console.log(input)
    var hash = (input % size) % size;
    var text = String(hash) + "=(" + String(input) + "%" + String(size) + ")%" + String(size)
    var result="";

    //Store collisions
    var collisions = new Array();
    if (typeof hash_table._buckets[hash] == 'undefined') {
        hash_table._buckets[hash] = input;
        drawNumber(input, hash, 1)
        result="Element inserted on table"
    }

    else {
        collisions.push(hash)
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        result="Collision occurred"
        ctx.strokeRect(initial_x + hash * 50, 50, 50, 50);
        setTimeout(function () { visualiseCollisionSimple(input, hash, hash); }, 400);

    }
    var desc = "Calculations: " + text + "<br/> Result: " + result;
    document.getElementById("description").innerHTML=desc;

}

function findSimpleHashing() {
    var value = document.getElementById('value').value;
    var hash = (value % size) % size;
    var stored_value = hash_table._buckets[hash];

    if (stored_value == value) {
        text="Element found"
        visualiseGreen(hash)
        setTimeout(function () { visualiseFinding(value, hash, 1); }, 700);
    }

    else {
        text = "Element not found"
    }

    var desc = "Result: " + text ;
    document.getElementById("description").innerHTML=desc;
}


function findChaining() {
    var value = document.getElementById('value').value;

    var hash = (value % size) % size;
    var stored_value = hash_table._buckets[hash];
    console.log(stored_value);
    if (typeof stored_value == undefined) {
        text = "Element not found"
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
                setTimeout(function () { visualiseFinding(value, hash, level); }, 700);
            }
        }
    }
    var desc = " Result: " + text;
    document.getElementById("description").innerHTML=desc;
}






function Chaining() {
    var value = document.getElementById('value').value;
    var hash = (value % size) % size;
    var text = String(hash) + "=(" + String(value) + "%" + String(size) + ")%" + String(size)

    if (typeof hash_table._buckets[hash] == 'undefined') {
        result="Element added to the table"
        hash_table._buckets[hash] = new Array();
        hash_table._buckets[hash].push(value);
        drawNumber(value, hash, 1)
    }

    else if (hash_table._buckets[hash].length == 5) {
        var result = "Sorry, we can not proceed further"
    }
    else {
        result="Collision occurred! Chaining performed!"
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
    var desc = "Calculations: " + text + "<br/> Result: " + result;
    document.getElementById("description").innerHTML=desc;
}



function linearProbing() {
    ctx.clearRect(300, 150, 500, 300);
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var text = String(hash) + "=(" + String(value) + "mod" + String(size) + ")+" + String(prob) + ")mod" + String(size)
    var prev_hash = hash;
    console.log(prev_hash);
    var collisions = new Array();
    var values = new Array();
if (typeof hash_table._buckets[hash] == 'undefined'){
    result="Element inserted on the table"
}

    while (typeof hash_table._buckets[hash] !== 'undefined') {
        result="Collision occurred! Linear probing applied."
        stored_value = hash_table._buckets[hash];
        collisions.push(hash);
        values.push(stored_value)
        prob = prob + 1;
        hash = ((value % size) + prob) % size;

        if (prev_hash == hash) {
            ctx.clearRect(300, 150, 500, 300);
            text = "Result: No valid empty positions";
            document.getElementById("description").innerHTML=text;

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

    var desc = "Calculations: " + text + "<br/> Result: " + result;
    document.getElementById("description").innerHTML=desc;

    hash_table._buckets[hash] = value;
    drawNumber(value, hash, 1)

}


function findLinearProbing() {
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var stored_value = hash_table._buckets[hash];
    console.log(stored_value);
    if (typeof stored_value == undefined) {
        text = "Result: Element not found"
        document.getElementById("description").innerHTML=text;

    }
    else {
        while (stored_value !== value) {
            prob = prob + 1;
            hash = ((value % size) + prob) % size;
            stored_value = hash_table._buckets[hash];
            if (typeof stored_value == undefined) {
                text = "Result: Element not found"
                document.getElementById("description").innerHTML=text;
            break;
            }
        }
        text = "Result: Element  found"
        document.getElementById("description").innerHTML=text;
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
    if (typeof hash_table._buckets[hash] == 'undefined'){
        result="Element inserted on the table"
    }

    while (typeof hash_table._buckets[hash] !== 'undefined') {
        result="Collision occurred! Quadratic probing applied."
        stored_value = hash_table._buckets[hash];
        collisions.push(hash);
        values.push(stored_value)
        prob = Math.pow((prob + 1), 2);
        hash = ((value % size) + prob) % size;

        if (prev_hash == hash) {
            text = "No valid empty positions";
            document.getElementById("description").innerHTML=text;
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

    var desc = "Calculations: " + text + "<br/> Result: " + result;
    document.getElementById("description").innerHTML=desc;
    hash_table._buckets[hash] = value;
    drawNumber(value, hash, 1)

}


function bloom() {
    ctx.clearRect(0, 48, 1000, 300);
    var value = document.getElementById('value').value;
    var hash1 = murmurhash3_32_gc(value, seed) % size;
    var hash2 = fnv1s(value) % size;
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
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';

    var desc = "String: " + value + "<br/>Murmur hash: " + hash1 + "<br/>FNV hash: " + hash2;
    $("#description").html(desc);
    if (bloomCounter == 1) {
        $("#bloomTable").append('<thead id="bloomTableHead"><tr><th scope="col">#</th><th scope="col">String</th><th scope="col">Murmur</th><th scope="col">FNV</th></tr></thead>');
        $("#bloomTable").append('<tbody id="bloomTableBody"></tbody>');
    }
    $("#bloomTableBody").append('<tr onclick="selectBloom($(this))" class="bloomRow"><th scope="row">' + bloomCounter + '</th><td id="val">' + value + '</td><td id="hash1">' + hash1 + '</td><td id="hash2">' + hash2 + "</td></tr>");
    bloomCounter++;
    greens.add(hash1);
    greens.add(hash2);

    var falsePositiveProb = Math.round((Math.pow(greens.size / size, 2)) * 100);
    $("#collisionProb").text("False positive probability: " + falsePositiveProb + "%");
}


function selectBloom(el) {
    console.log(el);
    ctx.clearRect(0, 48, 1000, 300);
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


function findBloom() {
    ctx.clearRect(0, 48, 1000, 300);
    var value = document.getElementById('value').value;
    var hash1 = murmurhash3_32_gc(value, seed) % size;
    var hash2 = fnv1s(value) % size;
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
    if (greens.has(hash1)){
        ctx.fillStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeStyle = "blue";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
    } else {
        ctx.fillStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeStyle = "blue";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
    }
    ctx.beginPath();
    ctx.rect(initial_x + hash2 * 50, 50, 50, 50); 
    if (greens.has(hash2)){
        ctx.fillStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeStyle = "blue";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
    } else {
        ctx.fillStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeStyle = "blue";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
    }
    if (greens.has(hash1) && greens.has(hash2)) {
        $("#description").text("'" + value + "' is probably in the filter");
    } else {
        $("#description").text("'" + value + "' is definitely not in the filter");
    }
}


function universalHashing(key, prime, tableSize) {
    var a = Math.floor(Math.random() * (prime));
    var b = Math.floor(Math.random() * (prime - 1) + 1);
    var hash = ((a * key + b) % prime) % tableSize;
    return hash;
}


function isPrime(num) {
    if (num <= 1) {
        return true;
    } else if (num <= 3) {
        return true;
    } else if (num % 2 === 0 || num % 3 === 0) {
        return false;
    }

    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) {
          return false;
        }
        i += 6;
    }

    return true;
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

  
function findQuadraticProbing() {
    prob = 0
    var value = document.getElementById('value').value;
    var hash = ((value % size) + prob) % size;
    var stored_value = hash_table._buckets[hash];
    console.log(stored_value);
    if (typeof stored_value == undefined) {
        text = "Result: Element not found"
        document.getElementById("description").innerHTML=text;

    }

    else {
        while (stored_value != value) {
            prob = Math.pow((prob + 1), 2);
            hash = ((value % size) + prob) % size;
            stored_value = hash_table._buckets[hash];
            if (typeof stored_value == undefined) {
                text = "Result: Element not found"
                document.getElementById("description").innerHTML=text;
            break;
            }
        }
        text = "Result: Element  found"
        document.getElementById("description").innerHTML=text;
    }

    visualiseGreen(hash)
    setTimeout(function () { visualiseFinding(value, hash, 1); }, 700);
}
  

window.onload = function () {
}; 

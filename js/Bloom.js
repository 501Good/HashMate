$(function() {
    $("#create").click(function() {
        createBloomFilterTable();
    });
});

function createBloomFilterTable() {
    $("#bitvector").empty()
        .append('<tr id="bits"></tr>')
        .append('<tr id="labels"></tr>');
    var nboxes = parseInt($("#myRange").val(), 10);
    for (var i=0; i<nboxes; i++) {
        $("#bits").append('<td id="bit" i="' + i + '" width=20>&nbsp;</td>');
        $("#labels").append('<td id="label" i="' + i + '" align="center">' + i + '</td>');
      }
}


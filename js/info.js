var open_closed_linear=-1;
var open_closed_quadratic=-1;
var open_closed_chaining=-1;
var open_closed_bloom=-1;
var open_closed_universal=-1;

var text_linear = " Linear Probing is a method to resolve collisions by using just a regular one dimensional array. The techniques where we do not use additional space are called closed addresing. "+
"The insertion algorithm is as follows: Firstly use hash function to find index for a key. If that spot is occupied, we continue to find next available spot in a higher index."+
"If we reach the end of the hash table we go back to the begining. In order to avoid an infinite loop in cases with no empty spot we keep track of the position where we started. If we encounter it again we break the loop"+
"Records  adjacent to each other without any empty spots form clusters" + 
"To search we hash the key with same hash function and move forward till the element found. To speed up the search we break the loop as soon as an empty slot is found."
   
var text_quadratic = "Quadratic Probing, same as Linear Probing,  is a method to resolve collisions by using just a regular one dimensional array. The techniques where we do not use additional space are called closed addresing. "+
"The insertion algorithm is as follows: Firstly use hash function to find index for a key. If that spot is occupied, we continue to find next available spot in a higher index."+
"If we reach the end of the hash table we go back to the begining. In order to avoid an infinite loop in cases with no empty spot we keep track of the position where we started. If we encounter it again we break the loop"+
"Records  adjacent to each other without any empty spots form clusters" + 
"To search we hash the key with same hash function and move forward till the element found. "
var text_chaining = "Chaining uses extra space to solve the collsions, that is why is part of open adressing schemes. The main idea is to add elements which hash in the same position in a linked list."+
"all of the data storage issues are handled by the list at the hash element, and not the hash table structure itself."
var text_bloom = "Bloom filters are probabilistic data structures that support two operations add andcontains. Different number of hash tables with fixed size. Hash each element to thetables individually without keeping track of collisions or keys."+ 
"The bit will be set to 1 for each of the positions we are adding the element. To see if the element it exist in the hash tables you hash same element again and check if the bit in those position" +
"is equal to one. All bits should be one for the response to be ” possibly in the table” because the bits might have been overwritten by other elements. In this case we get a false positive. "+
"False positive rate depends from the size of hash tables. When the size increases the rate of false positives will decrease exponentially. If at least one bit is 0 the response will be definitely not in the table."

var text_universal = "Universal hashing is selecting a hash function from a family of hash functions with a certain mathematical property. This helps to avoid a high number of collisions. " +
"The mathematical property for the universal hashing is that it usually guarantees a uniform distribution of hash values."

function showLinear() {
    if(open_closed_linear==-1){
    document.getElementById("text1").innerHTML = text_linear;
}
else{
    document.getElementById("text1").innerHTML=""
}
open_closed_linear*=-1;}

function showQuadratic() {

    if(open_closed_quadratic==-1){
        document.getElementById("text2").innerHTML = text_quadratic;
    }
    else{
        document.getElementById("text2").innerHTML=""
    }
    open_closed_quadratic*=-1;

}


function showChaining() {

    if(open_closed_chaining==-1){
        document.getElementById("text3").innerHTML = text_chaining;
    }
    else{
        document.getElementById("text3").innerHTML=""
    }
    open_closed_chaining*=-1;
}

function showBloom() {

    if(open_closed_bloom==-1){
        document.getElementById("text4").innerHTML = text_bloom;
    }
    else{
        document.getElementById("text4").innerHTML=""
    }
    open_closed_bloom*=-1;
}

function showUniversal() {

    if(open_closed_universal==-1){
        document.getElementById("text5").innerHTML = text_universal;
    }
    else{
        document.getElementById("text5").innerHTML=""
    }
    open_closed_universal*=-1;
}
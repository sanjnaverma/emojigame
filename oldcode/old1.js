// var lyricsArray = lyrics;
console.log("********");
var lyr2 = lyrics.replace( /\n/g, " \n " ).split( " " );
var lyr3 = String(lyrics);

// lyricsArray = lyricsArray.split(" ");
// console.log(lyricsArray[0]);
// var try1 = lyricsArray[0].replace( /\n/g, " \n " ).split( " " );
// console.log(try1);
// var tr2 = try1.join(' ');
// console.log(tr2);
var lyricsArray = "";
for(var i = 0; i < lyr2.length;i++){
  if(lyr2[i] == " "){
    lyricsArray+=" ";
  }else{
    lyricsArray+=lyr2[i];
  }

}
// lyricsArray.join(' ');
// lyricsArray = lyricsArray.replace( /\n/g, " \n " ).split( " " );
console.log(lyricsArray);
// lyricsArray = lyricsArray.join(' ');
// Array.prototype.join.call(lyricsArray, ' ')
// console.log(typeof(lyricsArray));

// lyricsArray = lyricsArray.replace( /\n/g, " <br> " ).split( " " );
// lyricsArray = lyricsArray.join(' ');

var emojiString = [{word:'baby', emoji:'&#x1F476;'}, {word:'heart', emoji:'&#x1F49C;'}, {word:'you', emoji:'&#x1F1FA;'}, {word:'I', emoji:'&#x1F440;'}, {word:'night', emoji:'&#x1F30C;'}, {word:'back', emoji:'&#x1F519;'}];

emojiString.push({word:'end', emoji:'&#x1F51A;'}, {word:'on', emoji:'&#x1F51B;'}, {word:'soon', emoji:'&#x1F51C;'}, {word:'top', emoji:'&#x1F51D;'});
emojiString.push({word:'cool', emoji:'&#x1F192;'}, {word:'free', emoji:'&#x1F193;'}, {word:'new', emoji:'&#x1F195;'}, {word:'ok', emoji:'&#x1F196;'});
var emojiCounter;
for(emojiCounter = 0; emojiCounter < emojiString.length; emojiCounter++){
  for(stringCounter = 0; stringCounter<lyr3.length;stringCounter++){
    // if(emojiString[emojiCounter].word == songLyrics[stringCounter]){
    // 	songLyrics[stringCounter] = emojiString[emojiCounter].emoji;
    // }
    if(lyr3[stringCounter].indexOf(emojiString[emojiCounter].word) > -1){
      lyr3[stringCounter] = emojiString[emojiCounter].emoji;
    }

  }
}

// lyricsArray = lyricsArray.join(' ');
lyricsArray+="";
console.log(typeof(lyr3));



lyrics = lyricsArray;






------.






document.addEventListener("DOMContentLoaded", main);
function main(evt) {
  //  var filterBtn = document.querySelector('#filterBtn');
  //  filterBtn.addEventListener('click', handleFilterButtonClick);
   //
  //  var addBtn = document.querySelector('#addBtn');
  //  addBtn.addEventListener('click', handleSend);

    var output = document.querySelector(".magicLyricsPrint");
    var thisIsText = output.innerHTML;


    //split by new lines
    //if it is a new line, then insert a break tag
    thisIsText = thisIsText.split(" ");
    // console.log(thisIsText);
    var start = 0;
    var end = 0;
    var i;
    var newbreak = document.createElement('br');
    var lyricdiv = document.createElement('div');
//div id = "endingHere"></div>
    for(i = 0; i < thisIsText.length; i++){
      if(thisIsText[i] == "\n"){
        console.log(thisIsText[i-1]);
        lyricdiv.texttContent = "*******";
        var magicLyricsPrintDiv = document.querySelector(".magicLyricsPrint");
        magicLyricsPrintDiv.appendChild(lyricdiv);

        // end = i;//so from like 0 to 5 needs to be in its own div and then 6(i) needs to be a break div
        // while(start < end){
        //   console.log("end"+ end);
        //   var newContent = thisIsText[start];
        //   lyricdiv.textContent = newContent;//(newContent); //adding lyrics to the lyric div
        //   start++;
        // }
        // //add the lyric div to the magicLyricsPrint div
        // var magicLyricsPrintDiv = document.querySelector(".magicLyricsPrint");
        // magicLyricsPrintDiv.appendChild(lyricdiv);
        //
        // //add the new break to the magicLyricsPrint div
        // if(start == end){
        //   var magicLyricsPrintDiv = document.querySelector(".magicLyricsPrint");
        //   magicLyricsPrintDiv.appendChild(newbreak);
        //
        //   // var endingDiv = document.getElementById("endingHere");
        //   // document.body.insertBefore(newbreak, endingDiv);
        //
        // }
        // start = end;
      }
    }
}

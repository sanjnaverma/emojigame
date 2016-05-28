/*Start Lyric generation*/
var lyrics = "";
var getLyricsScraped = function(artist, song){
  var magicLyrics;
  if(artist == "beyonce"){
    artist = "beyonceknowles";
  }else if (artist == "adele"){
    artist = "adele";
  }else{
    artist = artist.split(' ').join('');
    song = song.split(' ').join('');
  }

  var generateURL = 'http://azlyrics.com/lyrics/'+artist+'/'+song+'.html';
  request(generateURL, function (error, response, body) {
    // console.log(error, response, request);
    if (!error && response.statusCode == 200) {
      var splitted = [];
      splitted = body.split("<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->");
      var imp = splitted[1];
      var impSplit = [];
      impSplit = imp.split("<!-- MxM banner -->");
      finalOutPutLyrics = impSplit[0];
      // console.log(finalOutPutLyrics);
      /*fs.writeFile("test.txt", finalOutPutLyrics, function(err) {
          if(err) {
              return console.log(err);
          }
          // console.log("The file was saved!");
          // console.log(finalOutPutLyrics);
      }); */

      lyrics = finalOutPutLyrics;


      magicLyrics = parseLyrics(finalOutPutLyrics);
      magicLyrics = get2Paragraphs(magicLyrics);
      // console.log(lyrics);
      // return lyrics;
    }
  });
  // console.log(generateURL);

};


var parseLyrics = function(songLyrics){
  //first take out brackets and those things
  console.log("song is: "+songLyrics);
	var indicesThatNeedToBeDeleted = [];
  songLyrics = songLyrics.split(" ");
  var i;
  for(var i = 0; i <  songLyrics.length;i++){
		if(songLyrics[i].indexOf('[') > -1 || songLyrics[i].indexOf(']') > -1){
			console.log(songLyrics[i]);
			indicesThatNeedToBeDeleted.push(i);

		}
  }
	// console.log(indicesThatNeedToBeDeleted);
	var finalString = [];
	var deleteCounter = 0;
	var stringCounter;
	for(stringCounter = 0; stringCounter < songLyrics.length; stringCounter++){
		// console.log(songLyrics[stringCounter]);
		if(stringCounter == indicesThatNeedToBeDeleted[deleteCounter]){
			// console.log(stringCounter);
			//need to delete this and then increment deleteCounter
			deleteCounter+=1;
		}else{
			finalString.push(songLyrics[stringCounter]);
		}
	}

	songLyrics = finalString; //taking out final string variable


	//now add a space between all the carrots < >
	var try1 ;
	for(i = 0; i < songLyrics.length;i++){
		if(songLyrics[i].indexOf('<') >-1){
			// console.log(songLyrics[i]);
			songLyrics[i]= songLyrics[i].replace('<br>', ' <br> ');
			// console.log(songLyrics[i]);
		}
	}

	//join the string and then resplit it by space!
	songLyrics = songLyrics.join(' ').split(' ');
	//Now replace words with emojis


	var emojiString = [{word:'baby', emoji:'&#x1F476;'}, {word:'heart', emoji:'&#x1F49C;'}, {word:'you', emoji:'&#x1F1FA;'}, {word:'I', emoji:'&#x1F440;'}, {word:'night', emoji:'&#x1F30C;'}, {word:'back', emoji:'&#x1F519;'}];

  emojiString.push({word:'end', emoji:'&#x1F51A;'}, {word:'on', emoji:'&#x1F51B;'}, {word:'soon', emoji:'&#x1F51C;'}, {word:'top', emoji:'&#x1F51D;'});
  emojiString.push({word:'cool', emoji:'&#x1F192;'}, {word:'free', emoji:'&#x1F193;'}, {word:'new', emoji:'&#x1F195;'}, {word:'ok', emoji:'&#x1F196;'});


	var emojiCounter;
	for(emojiCounter = 0; emojiCounter < emojiString.length; emojiCounter++){
		for(stringCounter = 0; stringCounter<songLyrics.length;stringCounter++){
			// if(emojiString[emojiCounter].word == songLyrics[stringCounter]){
			// 	songLyrics[stringCounter] = emojiString[emojiCounter].emoji;
			// }
      if(songLyrics[stringCounter].indexOf(emojiString[emojiCounter].word) > -1){
        songLyrics[stringCounter] = emojiString[emojiCounter].emoji;
      }

		}
	}


	songLyrics = songLyrics.join(' ');
	console.log(songLyrics);
	return songLyrics;//this is the parse and emoji replaced string
};

var get2Paragraphs = function(lyrics){
	lyrics = lyrics.split(" ");


	var counter = 0;
	var paragraphEndsHere = [];
	var paragraphStartsHere = [];
	while(counter < lyrics.length){
		if(lyrics[counter] == "<br>" && lyrics[counter+1].indexOf("<br>") > -1){
			// console.log(lyrics[counter]);
			// console.log(lyrics[counter+1]);
			paragraphEndsHere.push(counter);
			paragraphStartsHere.push(counter+1);
		}
		counter+=1;
	}

	// console.log(paragraphEndsHere);
	// console.log(paragraphStartsHere);
	var displayCounter = 0;
	var displayThis = [];
	while(displayCounter < paragraphStartsHere[0]){
		displayThis.push(lyrics[displayCounter]);
		displayCounter+=1;
	}

	//join the displayThis
	displayThis = displayThis.join(' ');

	console.log(displayThis);
	return displayThis;
};

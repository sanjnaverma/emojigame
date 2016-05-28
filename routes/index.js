require("../db.js");

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var request = require('request');
var lyrFetchAPI = require('lyrics-fetcher');



var Song = mongoose.model('Song');
var User = mongoose.model('User');
var Lyrics = mongoose.model('Lyrics');
var FaveEmojis = mongoose.model('FaveEmojis');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {layout:'layout-login'} );
  // res.redirect('/songs');
});

router.get('/index', function(req, res, next) {
  res.render('index', {layout:'layout-login'} );
  // res.redirect('/songs');
});



/*Start Login Process*/

router.get('/login', function(req, res) {
  res.render('login', {layout:'layout-login'} );
});

router.post('/login', function(req,res,next) {
  // NOTE: use the custom version of authenticate so that we can
  // react to the authentication result... and so that we can
  // propagate an error back to the frontend without using flash
  // messages
  passport.authenticate('local', function(err,user) {
    if(user) {
      // NOTE: using this version of authenticate requires us to
      // call login manually
      req.logIn(user, function(err) {
        res.redirect('/welcome');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.', layout:'layout-login'} );
    }
  })(req, res, next);
});

router.get('/register', function(req, res) {
  res.render('register', {layout:'layout-login'} );
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}),
      req.body.password, function(err, user){
    if (err) {
      // NOTE: error? send message back to registration...
      console.log(err);
      res.render('register',{message:'Your registration information is not valid', layout:'layout-login'} );
    } else {
      // NOTE: once you've registered, you should be logged in automatically
      // ...so call authenticate if there's no error
      passport.authenticate('local')(req, res, function() {
        res.redirect('/welcome');
      });
    }
  });
});

router.get('/logout', function(req, res) {
    req.logOut();
    // res.redirect('/', {layout:'layout-login'});
    res.redirect('/')
});


/*End Login Process*/

/*start welcome page*/
router.get('/welcome', function(req, res){
  res.render('welcome');
});
/*end welcome page*/


/*AJAX*/
/*
Should be able to filter based on song artist
*/
router.get('/songs', function(req, res){
  var songFilter = {},
  searchExists = false;

  if(req.query.artist) {
    songFilter.artist = req.query.artist;
    searchExists = true;
  }

  Song.find(songFilter, function(err, songs, count) {
    // console.log("look at the songs");
    // console.log(songs);
    res.render('songs', {'songs': songs, searchExists: searchExists, artist: req.query.artist });
  });
});

router.get('/api/songs', function(req, res){
  var songFilter = {},
    searchExists = false;

  if(req.query.artist) {
    songFilter.artist = req.query.artist;
    searchExists = true;
  }

  Song.find(songFilter, function(err, songs, count) {
    res.json(songs);
  });
});


router.post('/api/songs', function(req, res) {
  var songTitleToBeNormalized = req.body.songTitle;
  songTitleToBeNormalized = songTitleToBeNormalized.split(" ");
  songTitleToBeNormalized.forEach(function(ele, ind){
  	// console.log(ele);
  	ele = ele.toLowerCase();
  	console.log(ele);
  	songTitleToBeNormalized[ind] = ele;

  });
  songTitleToBeNormalized = songTitleToBeNormalized.join(" ");
  console.log(songTitleToBeNormalized);

  var artistToBeNormalized = req.body.songArtist;
  artistToBeNormalized = artistToBeNormalized.split(" ");
  artistToBeNormalized.forEach(function(ele, ind){
  	// console.log(ele);
  	ele = ele.toLowerCase();
  	console.log(ele);
  	artistToBeNormalized[ind] = ele;

  });
  artistToBeNormalized = artistToBeNormalized.join(" ");
  console.log(artistToBeNormalized);

  var addMe = new Song({
      title: songTitleToBeNormalized,
      artist: artistToBeNormalized
  });
  /*.save(function(err, song, count) {
    res.json(song);
  });*/

  var curtitle = songTitleToBeNormalized;
  var curartist= artistToBeNormalized;

  /*Adding lyrics to the lyrics schema*/

  lyrFetchAPI.fetch(curartist, curtitle, function(err, lyrics){
    var  emojiedLyrics = lyrics
     emojiedLyrics =  emojiedLyrics.replace( /\n/g, " <br> " ).split( " " );

    var emojiString = [{word:'baby', emoji:'&#x1F476;'}, {word:'heart', emoji:'&#x1F49C;'}, {word:'you', emoji:'&#x1F1FA;'}, {word:'I', emoji:'&#x1F440;'}, {word:'night', emoji:'&#x1F30C;'}, {word:'back', emoji:'&#x1F519;'}];

    emojiString.push({word:'end', emoji:'&#x1F51A;'}, {word:'on', emoji:'&#x1F51B;'}, {word:'soon', emoji:'&#x1F51C;'}, {word:'top', emoji:'&#x1F51D;'});
    emojiString.push({word:'cool', emoji:'&#x1F192;'}, {word:'free', emoji:'&#x1F193;'}, {word:'new', emoji:'&#x1F195;'}, {word:'ok', emoji:'&#x1F196;'});
    var emojiCounter;
    for(emojiCounter = 0; emojiCounter < emojiString.length; emojiCounter++){
      for(stringCounter = 0; stringCounter< emojiedLyrics.length;stringCounter++){
        // if(emojiString[emojiCounter].word ==  emojiedLyrics[stringCounter]){
        // 	 emojiedLyrics[stringCounter] = emojiString[emojiCounter].emoji;
        // }
        if( emojiedLyrics[stringCounter].indexOf(emojiString[emojiCounter].word) > -1){
           emojiedLyrics[stringCounter] = emojiString[emojiCounter].emoji;
        }
      }
    }

     emojiedLyrics =  emojiedLyrics.join(' ');
     emojiedLyrics =  emojiedLyrics.replace(/\s\s+/g, ' <br> ');
     emojiedLyrics =  emojiedLyrics.split(' <br> ');
     emojiedLyrics[0] = "startt";
    var index =  emojiedLyrics.indexOf("startt");
    var index2 =  emojiedLyrics.length-1;
    if (index > -1) {
       emojiedLyrics.splice(index, 1);
    }
    if(index2 > -1){
       emojiedLyrics.splice(index2, 1);
    }

     emojiedLyrics =  emojiedLyrics.join(' <br> ');

    var newL = new Lyrics({
      title: curtitle,
      artist: curartist,
      lyrics: lyrics,
      emojiLyrics: emojiedLyrics
    });

    newL.save(function(err, savedL, count){
    if(err){
      console.log(err);
      res.send(err);
    }
  });
});

  /*End adding lyrics to the lyrics schema*/

  addMe.save(function(err, song, count){
    res.json(song);
  })

});


/*End AJAX*/

/*start game*/
//take all songs in DB and add lyrics
router.get('/invalid', function(req, res){
  res.render('invalid', {layout:'layout-login'});
});

router.get('/lose', function(req, res){
  res.render('lose');
});

router.get('/win', function(req, res){
  res.render('win');
});


router.post('/game1', function(req, res){


  var userGuess = req.body.songGuess;
  var answer = req.body.magicLyrics;

  /*normalize the strings*/
  userGuess = userGuess.split(" ");
  userGuess.forEach(function(ele, ind){
  	// console.log(ele);
  	ele = ele.toLowerCase();
  	// console.log(ele);
  	userGuess[ind] = ele;

  });
  userGuess = userGuess.join(" ");
  console.log(userGuess);


  console.log(answer);

  // console.log(answer);
  // res.send(answer);
  Lyrics.findOne({"emojiLyrics":answer}, function(err, lyrics, count){
    if(err){
      res.send(err);
    }else{
      if(userGuess == lyrics.title){
        // res.send("we have a match");
        res.redirect('/win');
      }else{
        // res.send("youre wrong");
        res.render('game1', {lost: "Sorry that was the wrong guess, try again!", magicLyrics: answer});

      }

      // res.send(lyrics);

    }
  });
  // Lyrics.findOne({"title":userGuess}, function(err, lyrics, count){
  //
  //   Lyrics.findOne({"emojiLyrics":answer}, function)
  //   console.log("*******");
  //   // var correctanswer = answer;
  //   // console.log(correctanswer);
  //   console.log(lyrics.title);
  //   if(answer == lyrics.emojiLyrics){
  //     res.send("yay");
  //   }else{
  //     res.send("boo");
  //   }
  //   // console.log(lyrics.lyrics);
  //   // if(lyrics){
  //   //   res.send("yay");
  //   // }else{
  //   //   res.send("boo");
  //   // }
  // });
});

var globalLyrics;
router.get('/game1', function(req, res){//this is called when "Play Game is hit"
  //add all lyrics to the lyrics DB


  var gameDict = [];

  Song.find({}, function(error, songs, count){
    if(error || songs.length < 1){
      res.redirect('songs');
    }
    if(!error && songs.length >= 1){
      var i;
      for (i = 0; i < songs.length; i++){
        var current = songs[i];
        var curtitle =current.title;
        var curartist = current.artist

        gameDict.push({
          "songtitle":curtitle,
           "artistname":curartist
        });

      }
        //done going through and appending songs to the gameDict
    }

    if(gameDict.length != 0){
      var magicNum = Math.floor((Math.random() * songs.length));
      console.log(gameDict[magicNum].artistname);
      console.log(gameDict[magicNum].songtitle);
      var magicArtist = gameDict[magicNum].artistname;
      var magicSong = gameDict[magicNum].songtitle;
      // Lyrics.findOne({'title':magicArtist}, function(err, lyrics, count){
      //   // if(lyrics){
      //     var artistToFind = lyrics.artist;
      //     var lyricsArray =lyrics.emojiLyrics;
      //     var originalLyrics = lyrics.lyrics;
      //     res.render('game1', {'magicLyrics':lyricsArray, 'originalLyrics':originalLyrics});// {'layout':"gamelayout"});
      //   // }
      // });

      lyrFetchAPI.fetch(magicArtist, magicSong, function(err, lyrics){//magicArtist, magicSong, function(err, lyrics){
        // console.log(err || lyrics);
        var originalLyrics = lyrics;
        globalLyrics = lyrics;
        var lyricsArray = lyrics;
        // console.log(lyricsArray);
        lyricsArray = lyricsArray.replace( /\n/g, " <br> " ).split( " " );

        var emojiString = [{word:'baby', emoji:'&#x1F476;'}, {word:'heart', emoji:'&#x1F49C;'}, {word:'you', emoji:'&#x1F1FA;'}, {word:'I', emoji:'&#x1F440;'}, {word:'night', emoji:'&#x1F30C;'}, {word:'back', emoji:'&#x1F519;'}];

        emojiString.push({word:'end', emoji:'&#x1F51A;'}, {word:'on', emoji:'&#x1F51B;'}, {word:'soon', emoji:'&#x1F51C;'}, {word:'top', emoji:'&#x1F51D;'});
        emojiString.push({word:'cool', emoji:'&#x1F192;'}, {word:'free', emoji:'&#x1F193;'}, {word:'new', emoji:'&#x1F195;'}, {word:'ok', emoji:'&#x1F196;'});
        var emojiCounter;
        /*need to include forEach*/

        emojiString.forEach(function(element, index){
        	lyricsArray.forEach(function(element2, index2){
        		if(element2.indexOf(element.word) >-1){
        			// console.log(element2);
        			// element2 = element.emoji;
        			lyricsArray[index2] = element.emoji;
        		}
        		// console.log(element2);
        	});
        	// console.log(element.word);
        });


      	/*for(emojiCounter = 0; emojiCounter < emojiString.length; emojiCounter++){
      		for(stringCounter = 0; stringCounter<lyricsArray.length;stringCounter++){
      			// if(emojiString[emojiCounter].word == lyricsArray[stringCounter]){
      			// 	lyricsArray[stringCounter] = emojiString[emojiCounter].emoji;
      			// }
            if(lyricsArray[stringCounter].indexOf(emojiString[emojiCounter].word) > -1){
              lyricsArray[stringCounter] = emojiString[emojiCounter].emoji;
            }
      		}
      	}*/

        /*end inclusion of forEach*/

        lyricsArray = lyricsArray.join(' ');
        lyricsArray = lyricsArray.replace(/\s\s+/g, ' <br> ');
        lyricsArray = lyricsArray.split(' <br> ');
        lyricsArray[0] = "startt";
        var index = lyricsArray.indexOf("startt");
        var index2 = lyricsArray.length-1;
        if (index > -1) {
          lyricsArray.splice(index, 1);
        }
        if(index2 > -1){
          lyricsArray.splice(index2, 1);
        }

        lyricsArray = lyricsArray.join(' <br> ');

        res.render('game1', {'magicLyrics':lyricsArray, 'originalLyrics':originalLyrics});// {'layout':"gamelayout"});
      })

    }

  });// end songs.find
});

/*end game*/

/*Adding last schema for emojis*/
router.get('/pickYourEmojis', function(req, res){
  res.render('pickYourEmojis');
});

router.post('/pickYourEmojis/add', function(req, res, next){
    var newFaveEmojis = new FaveEmojis({
        emojiHTML: req.body.check,
    });

    newFaveEmojis.save(function(err, em, count){
      if(err){
        console.log(err);
        res.redirect('/pickYourEmojis');
      }else{
        res.redirect('/showYourFaves');
      }
    });
});

router.get('/showYourFaves', function(req, res){
  FaveEmojis.find({}, function(err, ems, count){
    // console.log(ems[0].emojiHTML);
    var i;
    var currFaveinDB = [];
    for(i = 0; i < ems.length;i++){
      currFaveinDB.push(ems[i].emojiHTML);
    }
    res.render('showYourFaves', {ems:currFaveinDB});
  });
});



/*End adding last schema for emojis*/



module.exports = router;

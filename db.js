var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var URLSlugs = require('mongoose-url-slugs');//a plugin for mongoose that automatically creates a unique slug property in a specified object



var Song = new mongoose.Schema({
    title: {type: String, required: true},
    artist: {type: String, required: true},
    counter: {type: Number}
});

//Lyrics will be invisible to the user --> using this for answer validation
var Lyrics = new mongoose.Schema({
    title: {type: String, required: true},
    artist: {type: String, required: true},
    lyrics: {type: String},
    emojiLyrics: {type: String}
});

var Words = new mongoose.Schema({
    definition: String
});

var EmojiDefs = new mongoose.Schema({
    emoticon: {type: String},
    meanings: [Words]
});




var UserSchema = new mongoose.Schema({ });
// NOTE: we're using passport-local-mongoose as a plugin
// our schema for user looks pretty thin... but that's because
// the plugin inserts salt, password and username
UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
mongoose.model('Song', Song);
mongoose.model('Lyrics', Lyrics);
mongoose.model('EmojiDefs', EmojiDefs);
mongoose.model('Words', Words);


mongoose.connect('mongodb://localhost/finalproj');

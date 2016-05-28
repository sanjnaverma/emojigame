document.addEventListener("DOMContentLoaded", main);
function main(evt) {
   var filterBtn = document.querySelector('#filterBtn');
   filterBtn.addEventListener('click', handleFilterButtonClick);

   var addBtn = document.querySelector('#addBtn');
   addBtn.addEventListener('click', handleSend);
}

function handleFilterButtonClick(evt) {
    evt.preventDefault();
    // console.log("button clicked");
    // get the value of the input field
    var artist = document.querySelector('#artist').value;


    // console.log(artist);
    // create the object
    /*Normalize the artist string*/

    // artist = string2.split(" ");
    // artist.forEach(function(ele, ind){
    // 	// console.log(ele);
    // 	ele = ele.toLowerCase();
    // 	console.log(ele);
    // 	artist[ind] = ele;
    //
    // });
    // artist = artist.join(" ");
    // console.log(artist);
    /*End normalization*/
    var req = new XMLHttpRequest();

    // configure
    var url = "http://localhost:3000/api/songs?artist=" + artist;
    req.open("GET", url);

    req.addEventListener('load', function(evt) {
        console.log('loaded repos');
        var data = JSON.parse(req.responseText);
        console.log(data);

        //get table
        var songTable = document.getElementById('song-list');

        //delete contents of the table
        while(songTable.firstChild){
      		songTable.removeChild(songTable.firstChild);
      	}

        var rowcounter = 0;
        while(rowcounter < data.length){
          var newrow = document.createElement('tr');
          var filteredtitle = document.createElement('td');
          var filteredartist = document.createElement('td');

          filteredtitle.textContent = data[rowcounter].title;
      		filteredartist.textContent = data[rowcounter].artist;

      		newrow.appendChild(filteredtitle);
      		newrow.appendChild(filteredartist);

      		songTable.appendChild(newrow);

          rowcounter+=1;
        }
        // console.log("table is created");
    });
    document.querySelector('#artist').value = "" ;


    // send
    req.send();
}




//delete all elements from table

//create a new table w the filtered element data


function handleSend(evt) {
    evt.preventDefault();

    var req = new XMLHttpRequest();
    req.open('POST', '/api/songs');
    req.addEventListener('load', function() {
        console.log(req.responseText);
    });

    req.addEventListener('error', function() {
        console.log(req.responseText);
    });

    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    // url encoded.... name value pairs
    // name=value
    var data = 'songTitle=' + document.querySelector("#songTitle").value + "&songArtist=" + document.querySelector("#songArtist").value  ;
    var songTable = document.getElementById('song-list');

    var newrow = document.createElement('tr');
    var newtitle = document.createElement('td');
    var newartist = document.createElement('td');

    newtitle.textContent = document.querySelector("#songTitle").value;
    newartist.textContent = document.querySelector("#songArtist").value;

    newrow.appendChild(newtitle);
    newrow.appendChild(newartist);

    songTable.appendChild(newrow);

    // console.log("table is created");

    // console.log(data);

    document.querySelector("#songTitle").value = "";//reset the values in the form
    document.querySelector("#songArtist").value = ""; //reset the values in the form
    req.send(data);
}

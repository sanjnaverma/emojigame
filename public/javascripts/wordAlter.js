
document.addEventListener("DOMContentLoaded", main);

function main(evt) {
  var some1 = document.querySelector('.magicLyricsPrint');
  var some = some1.innerHTML;
  console.log("*****");
  // console.log(some);

  var words = some.split("<br>");
  console.log(words);

  //take out br and " "
  var wordsOut = [];
  var j;
  for(j = 0; j<words.length; j++){
    if(words[j] != "<br>" || words[j] != " "){
      wordsOut.push(words[j]);
    }
  }
  words = wordsOut;

  var freq_list = [];
  var frequency_list = [];
  var nums = [];
  var i;

  for(i = 0; i <words.length;i++){
    var randomNum = Math.floor((Math.random() * 50) + 1);
    nums.push(randomNum);
  }

  for (i=0; i <words.length; i++){
      var element = {"text":words[i], "size":nums[i]};

      frequency_list.push(element);
  }

  console.log(frequency_list);
  // some1.innerHTML = frequency_list;

  var color = d3.scale.linear()
  .domain([12,13,14,15,16, 20, 25, 30, 40])
  .range(["#abc63c", "#0096d6", "#c0d0e0", "#bbd162", "#7fcaea", "#32abde", "#dde8b1", "#b3cb4f", "#cceaf6", "#66c0e6", "#dadde0", "#66c0e6", "777"])

  function draw(words) {
        d3.select("#d3GoesHere").append("svg")
              .attr("width", 1000)
              .attr("height", 600)
              .append("g")
              .attr("transform", "translate(500,200)")
              .selectAll("text")
              .data(words)
              .enter().append("text")
              .style("font-size", function(d) { return d.size + "px"; })
              .style("fill", function(d, i) { console.log("**"+i); return color(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
      }

  some1.innerHTML = d3.layout.cloud()
            .size([1000, 500])
            .words(frequency_list)
            .padding(5)
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start()
            .text();

    some1.className += " hideMeD3";
}

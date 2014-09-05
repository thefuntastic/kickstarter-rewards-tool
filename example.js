var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');


// request('https://www.kickstarter.com/projects/lofi/four-sided-fantasy-a-game-about-the-limits-of-the', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
   
//   }
// })
var srcs =[ 
    "https://www.kickstarter.com/projects/2011341880/knite-and-the-ghost-lights?ref=kickspy",
    "https://www.kickstarter.com/projects/379113968/spate"
    // "https://www.kickstarter.com/projects/kitfoxgames/moon-hunters-a-myth-weaving-rpg"

]

for (var i = 0; i < srcs.length; i++) {

    console.log('requesting: ' + srcs[i]);

    //Self executing function to freeze scope
    request(srcs[i], (function(current){
                return  function(error, response, body){
                        if(error) throw error;
                        if (response.statusCode == 200) {
                            parse(current, body);
                        }
                    }
            } )(srcs[i]));
};

// request(srcs[0], function(error, response, body)
// {
//     if(error) throw error;

//     if (!error && response.statusCode == 200) {

//         parse(srcs[0], body);
//     }

// });



// fs.readFile("test.html", function(err, response){
//     if(err) throw err;

//     parse("https://www.kickstarter.com/projects/kitfoxgames/moon-hunters-a-myth-weaving-rpg", response);
// });

var data = null;

var parse = function ( url,  body) {

    console.log("parsing: " + url);

    $ = cheerio.load(body);

    if( data == null)
    {

        var response = fs.readFileSync("data.json");
        data = JSON.parse(response);

        if(data == null)
        {
             var data = { "items":[]};
        }
       
    } 

    var currency = 'USD';
    $('div#stats data').each (function(){
        if($(this).attr('data-currency'))
        {
            currency = $(this).attr('data-currency');
        }
    });

     var item = {
        "name": $('div#project-header h2').text(),
        "url" : url,
        "backers" : $("#backers_count").text().match(/\d+/g).join(""),
        "pledged" : $("div#pledged").text().match(/\d+/g).join(""),
        "currency": currency, 
        "goal" : $('div#stats span.money').text().match(/\d+/g).join(""),
        "rewards" : []
    };


    $('div.NS_backer_rewards__reward.p2 ').each(function (){
            // console.log($('h5.mb1 span.money', this).text());
            // console.log($('span.num-backers.mr1', this).text());
            // console.log($('div.desc p', this).text());

            var reward = {
                "tier" : $('h5.mb1 span.money', this).text().match(/\d+/g).join(""),
                "backers" :$('span.num-backers.mr1', this).text().match(/\d+/).join(""),
                "desc" : $('div.desc p', this).text()
            }

            item.rewards.push(reward);
      });

    // console.log(item);

    for (var i = 0; i < data.items.length; i++) {
        var found = false
        if(item.url == data.items[i].url)
        {
            data.items[i] = item;
            found = true;
            break;
        }
    };

    if(!found) data.items.push(item);

    fs.writeFileSync("data.json", JSON.stringify(data));
        

    
}
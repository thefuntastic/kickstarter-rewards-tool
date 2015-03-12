var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');


// request('https://www.kickstarter.com/projects/lofi/four-sided-fantasy-a-game-about-the-limits-of-the', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
   
//   }
// })
var srcs =[ 
    // "https://www.kickstarter.com/projects/lofi/four-sided-fantasy-a-game-about-the-limits-of-the",
    // "https://www.kickstarter.com/projects/2011341880/knite-and-the-ghost-lights?ref=kickspy",
    // "https://www.kickstarter.com/projects/379113968/spate",
    // "https://www.kickstarter.com/projects/kitfoxgames/moon-hunters-a-myth-weaving-rpg",
    // "https://www.kickstarter.com/projects/189665092/the-fall-dark-story-driven-exploration-in-an-alien",
    // "https://www.kickstarter.com/projects/punyhuman/blade-symphony?ref=play",
    // "https://www.kickstarter.com/projects/celsiusgs/drifter-a-space-trading-game?ref=play",
    // "https://www.kickstarter.com/projects/1499900830/sir-you-are-being-hunted?ref=play",
    // "https://www.kickstarter.com/projects/samanthazero/sentris-unleash-your-inner-musician"
    // "https://www.kickstarter.com/projects/ekuatorgames/celestian-tales-old-north-redefining-the-classic-r?ref=kickspy",
    // "https://www.kickstarter.com/projects/coldricegames/interstellaria?ref=kickspy",
    // "https://www.kickstarter.com/projects/1907053239/the-deer-god-a-game-of-reincarnation-pc-mac-linux?ref=kickspy",
    // "https://www.kickstarter.com/projects/starcommand/star-command-sci-fi-meets-gamedev-story-for-ios-an?ref=kickspy",
    // "https://www.kickstarter.com/projects/sleepninja/monsters-ate-my-birthday-cake?ref=kickspy",
    // "https://www.kickstarter.com/projects/sfbgames/detective-grimoire-mystery-adventure-game-for-ios?ref=kickspy",
    // "https://www.kickstarter.com/projects/soundself/soundself?ref=kickspy",
    // "https://www.kickstarter.com/projects/musicwizard/learn-to-play-music-in-minutes-and-kickstart-your?ref=kickspy",
    // "https://www.kickstarter.com/projects/682108903/jotun?ref=kickspy",
    // "https://www.kickstarter.com/projects/spaniardmike/candle-a-dynamic-graphic-adventure?ref=kickspy",
    // "https://www.kickstarter.com/projects/27467991/dashkin-a-game-of-high-speed-challenges-through-br?ref=kickspy",
    // "https://www.kickstarter.com/projects/leafygames/pulsar-lost-colony?ref=kickspy",
    // "https://www.kickstarter.com/projects/tammekagames/radial-g-a-high-octane-sci-fi-racer-for-the-vr-gen?ref=kickspy",
    // "https://www.kickstarter.com/projects/1561538328/lilt-line-too?ref=kickspy",
    // "https://www.kickstarter.com/projects/208431038/songmasters-the-music-wars?ref=kickspy",
    // "https://www.kickstarter.com/projects/ekuatorgames/celestian-tales-old-north?ref=kickspy",
    // "https://www.kickstarter.com/projects/14214732/colossal-kaiju-combat-expanded-and-upgraded-ouya?ref=kickspy",
    // "https://www.kickstarter.com/projects/rupa211/rock-vibe?ref=kickspy",
    // "https://www.kickstarter.com/projects/samread/dream-0?ref=kickspy",
    // "https://www.kickstarter.com/projects/1400130230/oceania-online-mmo-rpg?ref=kickspy",
    // "https://www.kickstarter.com/projects/1188957169/scale",
    // "https://www.kickstarter.com/projects/1307515311/night-in-the-woods",
    // "https://www.kickstarter.com/projects/infinitap/neverending-nightmares",
    // "https://www.kickstarter.com/projects/bischoff/stasis-2d-isometric-scifi-horror-adventure-game",
    "https://www.kickstarter.com/projects/1460250988/darkest-dungeon-by-red-hook-studios"






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
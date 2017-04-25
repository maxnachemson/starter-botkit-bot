//test
var Botkit = require('botkit')
var BotkitStorageBeepBoop = require('botkit-storage-beepboop')
var controller = Botkit.slackbot({debug: false, storage: BotkitStorageBeepBoop()})

require('beepboop-botkit').start(controller, {debug: true})


var request = require('request');

var options = {
      url: 'https://script.googleusercontent.com/macros/echo?user_content_key=nP1ifnCjqloshqQ-vUiCACVDAW9mYl6tlRHoneeT0VXPTq2ma57Tvh-RJKkAhEwgqTlxAlNRqM62I1U4KfUEetb64JXWiOffOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa1ZsYSbt7G4nMhEEDL32U4DxjO7V7yvmJPXJTBuCiTGh3rUPjpYM_V0PJJG7TIaKp-4yVWHBMQSOdR9UAH0gmL-ECaMHdSlEuMN-L4hJfPMG2eTZqffHiTs6rJGrx4fyGQ&lib=MbpKbbfePtAVndrs259dhPT7ROjQYJ8yx'
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        info = JSON.parse(body);
    }
    return info;
}

//request(options, callback);

    
    
controller.hears(["Hello","Hey","Hi","Yo"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    bot.reply(message,'Hi there!');
    console.log("Incoming message: "+message.text);
});

controller.hears(["Thank","Thanks","Thx"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    bot.reply(message,"You're welcome!");
});
controller.hears(["Talent"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    var talentMessage = {
        "attachments": [
        {
            "fallback": "Contact Lotta Martin",
            "color": "#36a64f",
            "pretext": "Sweet! Then Lotta is your lady! Contact her to arrange a meeting",
            "title": "lotta@anothertomorrow.io",
            "title_link": "mailto:lotta@anothertomorrow.io",
            "text": "+46 (0) 707 15 59 15",
            "author_name": "Lotta Martin - Head of Talent",
            "author_icon": "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAXnAAAAJDAxODA0NDk4LWVmMjgtNGFjMy05ZGRhLWUzNzBlYWEyZDRmNw.jpg"
        }
    ]
    }
    bot.reply(message,talentMessage);

});


controller.hears([/^.{0,}job.{0,}$/], ["direct_message","direct_mention","mention","ambient"], function (bot, message) {
  request(options, callback);
  console.log("Incoming message: "+message.text);
  bot.startConversation(message, function (err, convo) {
    convo.ask('What kind of job are you looking for?', function (response, convo) {
        
        theData = info['Blad1'];
        var results = [];
        toSearch = response.text.toLowerCase();
        toSearch = toSearch.replace("something", "");
        toSearch = toSearch.split( ' ' ).filter(function ( toSearch ) {
    		var word = toSearch.match(/(\w+)/);
    		return word && word[0].length > 2;
		}).join( ' ' ); 
		if (toSearch === "anything") {
			toSearch = "";
	  }
        categoryArr = [];
        //Loop through the data from the database
        for(var i=0; i<theData.length; i++) {
          categoryArr[i] = theData[i].category;
          for(key in theData[i]) {
            if(theData[i][key].toLowerCase().includes(toSearch)) {
              results.push(theData[i]);
              break;
            }
          }
        }

        //Filter category array & create message
        var categories = categoryArr.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
        var categoryMsg = "";
        for(var i=0; i<categories.length; i++) {
            categoryMsg += "*"+categories[i]+"*\n";
        }

        //Construct respond message
        var resultMessage = {
            "attachments":[]
        };
        var row = 0;
        for(var i=0; i<results.length; i++) {
            row++;
            console.log(row+" match");
            newrow = '';
            newrow = { 
                "fallback": "jobs jobs jobs",
                "color":"#36a64f",
                "title": " "+results[i].title+" @"+results[i].company+" ",
                "title_link": results[i].link
        };
        resultMessage['attachments'].push(newrow);
        }

        
        //Send respond message
        if (results.length > 0) {
            if (row === 1) {
                var ending = "";
            } else {
                var ending = "s";
            }
            convo.say("I found "+row+" opening"+ending+":");
            convo.say(resultMessage);
        } else {
            console.log("0 match");
            convo.say("I couldn't find any jobs related to _"+toSearch+"_");
            convo.ask('Try narrowing it down by choosing a category: \n'+categoryMsg, function (response, convo) {
                toSearch = response.text.toLowerCase();
                categoryArr = [];
                //Loop through the data from the database
                for(var i=0; i<theData.length; i++) {
                  categoryArr[i] = theData[i].category;
                  for(key in theData[i]) {
                    if(theData[i][key].toLowerCase().includes(toSearch)) {
                      results.push(theData[i]);
                      break;
                    }
                  }
                }
                //Construct respond message
                var resultMessage = {
                    "attachments":[]
                };
                var row = 0;
                for(var i=0; i<results.length; i++) {
                    row++;
                    console.log(row+" match");
                    newrow = '';
                    newrow = { 
                        "fallback": "jobs jobs jobs",
                        "color":"#36a64f",
                        "title": " "+results[i].title+" @"+results[i].company+" ",
                        "title_link": results[i].link
                };
                resultMessage['attachments'].push(newrow);
                }
                //Send respond message
                if (results.length > 0) {
                    if (row === 1) {
                        var ending = "";
                    } else {
                        var ending = "s";
                    }
                    convo.say("I found "+row+" opening"+ending+":");
                    convo.say(resultMessage);
                }
                convo.next();
            });

        }

      convo.next() // always call this to keep things flowing (check the readme for more info)
    })
  })
})

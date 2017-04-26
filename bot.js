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
    
    
controller.hears(["Hello","Hey","Hi"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    bot.reply(message,'Hi! Welcome to Another Tomorrow Talent. \nAre you looking for Talent or a Job?');
});

controller.hears(["Talent"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    var lottaMsg = {
        "attachments": [
        {
            "fallback": "Contact Lotta Martin",
            "color": "#168c7d",
            "pretext": "Great! Then Lotta is your lady! Contact her to arrange a meeting",
            "title": "lotta@anothertomorrow.io",
            "title_link": "mailto:lotta@anothertomorrow.io",
            "text": "+46 (0) 707 15 59 15",
            "author_name": "Lotta Martin - Head of Talent",
            "author_icon": "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAXnAAAAJDAxODA0NDk4LWVmMjgtNGFjMy05ZGRhLWUzNzBlYWEyZDRmNw.jpg"
        }
    ]
    }
    bot.reply(message,lottaMsg);
});


controller.hears([/^.{0,}job.{0,}$/], ["direct_message","direct_mention","mention","ambient"], function (bot, message) {
  request(options, callback);
  bot.startConversation(message, function (err, convo) {
    convo.ask('Sweet! What kind of job are you looking for?', function (response, convo) {
        
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
        var color = 0;
        var hex = "";
        var row = 0;
        for(var i=0; i<results.length; i++) {
            row++;
            color++;
            if (color == 1) {
                hex = "#168c7d";
            } else if (color == 2) {
                hex = "#f7b730";
            } else {
                hex = "#f4b7d4";
                color = 0;
            }
            newrow = '';
            newrow = { 
                "fallback": "job result",
                "color": hex,
                "title": " "+results[i].title+" @"+results[i].company+" ",
                "title_link": results[i].link,
        "footer": results[i].employment
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
            convo.say("Voila! \nI found "+row+" opening"+ending+":");
            convo.say(resultMessage);
        } else {
            convo.say("I couldn't find any current openings relating to _"+toSearch+"_");
            convo.ask('Right now we have opportunities in the following categories: \n'+categoryMsg, function (response, convo) {
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
                    newrow = '';
                    newrow = { 
                        "fallback": "job result",
                        "color":"#28ae95",
                        "title": " "+results[i].title+" @"+results[i].company+" ",
                        "title_link": results[i].link,
             "footer": results[i].employment
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
                    convo.say("Perfect, now I've found "+row+" opening"+ending+":");
                    convo.say(resultMessage);
                } else {
                        var lottaMsg2 = {
                            "attachments": [
                            {
                                "fallback": "Contact Lotta Martin",
                                "color": "#168c7d",
                                "pretext": "Please contact Lotta if you don't find what your looking for",
                                "title": "lotta@anothertomorrow.io",
                                "title_link": "mailto:lotta@anothertomorrow.io",
                                "text": "+46 (0) 707 15 59 15",
                                "author_name": "Lotta Martin - Head of Talent",
                                "author_icon": "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAXnAAAAJDAxODA0NDk4LWVmMjgtNGFjMy05ZGRhLWUzNzBlYWEyZDRmNw.jpg"
                            }
                        ]
                        }
                    convo.say("I couldn't find any current opportunities relating to _"+toSearch+"_");
                    convo.say(lottaMsg2);
                }
                convo.next();
            });

        }

      convo.next() // always call this to keep things flowing (check the readme for more info)
    })
  })
})
controller.hears(["Thank","Thanks","Thx"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    if (typeof x == 'undefined') {
        x = 1;
    }
    var thxMsg = "";
    if (x == 1) {
        thxMsg = "You're welcome!";
        x = 2;
    } else if (x == 2) {
        thxMsg = "Don’t mention it";
        x = 3;
    } else {
        thxMsg = "My pleasure";
        x = 1;
    }
    bot.reply(message,thxMsg);
});
controller.hears(["Fuck"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    bot.reply(message,"You'll have a hard time getting a job with that kind of language...");
});

controller.hears('','direct_message,direct_mention,mention',function(bot,message) {  
    bot.reply(message,"I'm sorry, I didn't quite catch that. Are you looking for Talent or a Job?");
})








//test
var Botkit = require('botkit')

var controller = Botkit.slackbot({debug: false})

require('beepboop-botkit').start(controller, {debug: true})



controller.hears(["Hello","Hey","Hi","Yo"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
    bot.reply(message,'Hi there!');
    console.log("Incoming message: "+message.text);
});

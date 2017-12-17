const Discord = require('discord.js');
const cfg = require('./config.json')

const chalk = require('chalk')
const Spinner = require('cli-spinner').Spinner;

var client = new Discord.Client({
  token: cfg.token,
  autorun: true
});

var loader = new Spinner(chalk.red("logging in.. ") + chalk.green("%s"));
loader.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");

loader.start();
// example: p! 0 | test -online
client.on('ready', async() => {
    loader.stop(true);
    console.log(chalk.red("account: ") + chalk.green(client.user.tag));
    console.log(chalk.red("prefix: ") + chalk.green(cfg.prefix)) ;
    await presence(cfg.default[0], cfg.default[1]);
    setInterval(function() {   
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.red("current: ") + chalk.green(client.user.presence.activity.type.toLowerCase()+ " " + client.user.presence.activity.name) + " " + chalk.yellow(client.user.presence.status));
    }, 300);
  });

client.on('message', message => {
  try{
  if (message.content.startsWith(cfg.prefix) == true && message.author.id == client.user.id){
    var status
    if (message.content.includes("-online")){status = "online"}
    if (message.content.includes("-offline")){status = "invisible"}
    if (message.content.includes("-idle")){status = "idle"}
    if (message.content.includes("-dnd")){status = "dnd"}  

    var arguments = message.content.substring(cfg.prefix.length + 1).replace("-online", "").replace("-offline", "").replace("-idle", "").replace("-dnd", "").split("|");
    presence(arguments[0].replace(/\s/g, ""), arguments[1], status);
    message.delete();
  }}catch(err){

  }
});

function presence(arg1, arg2, arg3) {
  var pType = parseInt(arg1)
  var pName = arg2
  if (arg3){
    var pStatus = arg3
    client.user.setPresence({status: pStatus, activity:{type: pType, name: pName}})
  }else{
    client.user.setPresence({activity:{type: pType, name: pName}});
  }
}

client.login(cfg.token);
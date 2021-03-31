
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const express = require('express');
const http = require('http');

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 1000 * 60 * 24);


const filter = function(message, array, boolean, text) {
  if (array.some(word => message.content.toLowerCase().replace(/[^\p{L} ]+/gu, "").includes(word))) {
    if (boolean) {
      setTimeout(() => {
        if (!message.deleted) {
          message.delete();
        };
      }, 1000)

      message.channel.send(`<@${message.member.id}>, ${text}`).then(m => { if (!m.deleted) m.delete({timeout: 10000}) });
    };
  };
};

const temizlik = async function(guildID, channelArray) {
  let guild = client.guilds.cache.get(guildID);

  channelArray.forEach(async channel => {
    let channel_old = guild.channels.cache.find(i => i.name == channel[0] && i.type == "text")
    if (!channel_old) return;
    const channel_old_position = channel_old.position;
    const channel_new = await channel_old.clone();

    await channel_old.delete();
    await channel_new.setPosition(channel_old_position);
  });
};

const reklamfilter = function(message, boolean, text) {
  let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
  if (message.member.hasPermission('ADMINISTRATOR')) return;

  if (discordInvite.test(message.content.toLowerCase())) {
    if (boolean) {
      setTimeout(() => {
        if (!message.deleted) {
          message.delete();
        };
      }, 1000)

      message.channel.send(`<@${message.member.id}>, ${text}`).then(m => { if (!m.deleted) m.delete({timeout: 10000}) });
    };
  };
};

client.on('ready', async () => {
  let gID = "800646687960989706;"
  console.log("Hazırım! - vexdy#3576"); 
  let kanallar = [
    ["bom"],
    ["tuttu-tutmadı"],
    ["sayı-sayma"],
    ["kelime-türetme"],
    ["「💬」sohbet"],
    ["「📷」galeri-chat"]
    ["「💻」bot-komut"],
    ["16x"],
    ["8x"],
    ["4x"],
  ];
  
  setInterval(() => { temizlik(gID, kanallar) }, 1000 * 60 * 24)
});

client.on("message", async (message) => {
  if (message.channel.type == "dm" || message.author.bot) return;
  let kufur = config.protection.kufur, tos = config.protection.tos, reklam = config.protection.reklam;
  let tosArray = config.words.tos, kufurArray = config.words.kufur;

  filter(message, tosArray, tos, "Sohbet filtremize takıldınız bu sunucuda bağzı kelimleri yazmak yasaktır **düzgün bir biçimde tekrar yazınız**");
  filter(message, kufurArray, kufur, "**Bu sunucuda küfür etmek yasaktır.**");
  reklamfilter(message, reklam, "**Bu sunucuda reklam yapamazsın!**")
});

client.on("guildMemberAdd", async (member) => {
  if (!member.user.bot) return;
  
  const audit = await member.guild.fetchAuditLogs({limit: 1, type: 'BOT_ADD'});
  const log = audit.entries.first();
  if (!log) return console.log('Kimin getirdiğini bulamadım.');
  
  const { executor, target } = log;

  if (executor.id == "497798509374734347") return;
  if (executor.id == "759875016602025984") return;

  // getiren kişiyi banla
  let exec = member.guild.members.cache.get(executor.id);
  await member.guild.members.ban(exec).catch(() => console.log("Botu getiren arkadaş banlanılamadı."));
  
  // botu banla
  let targ = member.guild.members.cache.get(target.id);
  await member.guild.members.ban(targ).catch(() => console.log("Getirilen bot banlanılamadı."));
  
  let embed = new Discord.MessageEmbed()
    .setColor('RED')
    .setDescription('**İzinsiz bir biçimde bot getirildi!**')
    .addField("Getiren", `${executor.id} - ${executor.username}${executor.discriminator}`)
    .addField("Getirilen", `${target.id} - ${target.username}#${target.discriminator}`)
  
  let logchannel = member.guild.channels.cache.find(c => c.name == "「💻」mod-komut");
  await logchannel.send(embed).catch(() => console.log("Bot getirilme mesajı gönderilemedi."));
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type == "dm") return;
  let kufur = config.protection.kufur, tos = config.protection.tos, reklam = config.protection.reklam;
  let tosArray = config.words.tos, kufurArray = config.words.kufur;
    
  filter(newMessage, tosArray, tos, "Sohbet filtremize takıldınız bu sunucuda bağzı kelimleri yazmak yasaktır **düzgün bir biçimde tekrar yazınız**");
  filter(newMessage, kufurArray, kufur, "**Bu sunucuda küfür etmek yasaktır.**");
  reklamfilter(newMessage, reklam, "**Bu sunucuda reklam yapamazsın!**")
});

client.on('message', async (message) => {

  if (message.channel.type == "dm") return;
  const prefix = config.bot.prefix;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type == "dm") return;


});


var prefix = config.prefix;

client.on('ready', () => {
  console.log(`Botunuz olan ${client.user.tag} sunucuya giriş yaptı!`);
});
client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('Aleyküm Selam Hoş Geldin');
  }
 
});

client.on('message', msg => {
  if (msg.content === '!lis') { 
  msg.channel.send('Bakımda');
      
  }
    
    });
    
  client.login(process.env.token);

client.on('message', msg => {
  if (msg.content === '#liste') { 
  msg.channel.send('Listeye Alınıyosunuz Adimin Bekleniyo....');
      
  }
    
    });

client.on('message', msg => {
  if (msg.content === 'liste') { 
  msg.channel.send('Listeye Alınıyosunuz Adimin Bekleniyo....');
      
  }
    
    });
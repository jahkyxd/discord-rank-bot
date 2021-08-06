const { Collection, Client, MessageEmbed } = require("discord.js")
const client = new Client
const config = require("./config.json")
const fs = require("fs")
const qdb = require("quick.db")
const kdb = new qdb.table("kullanici");
const adb = new qdb.table("ayarlar");
const db = new qdb.table("level");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();

client.on("ready", () => {
    client.user.setPresence({ activity: { name: config.readyfooter }, status: "dnd" })
})

client.on("ready", () => {
    const seskanal = client.channels.cache.get(config.seskanal)
    if (!seskanal) return
    seskanal.join()
})

setInterval(() => {
    const seskanal = client.channels.cache.get(config.seskanal)
    if (!seskanal) return
    seskanal.join()
}, 1);


fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    if (!command.name) return console.log(`Hatalı Kod Dosyası => [/commands/${files}]`)
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})

client.on('message', message => {
    if (!message.guild || message.author.bot || !message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const embed = new MessageEmbed().setFooter(config.footer).setColor("#661c1c")
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args,)
})


client.login(config.token).then(x => console.log(`${client.user.username} Olarak giriş yapıldı bot aktif`)).catch(err => console.log("bot giriş yapamadı"))


let sonMesaj = {};
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.length <= 6) return;
    let ayarlar = adb.get('ayar') || {};
    if (sonMesaj[message.author.id])
        if ((Date.now() - sonMesaj[message.author.id]) / 1000 <= 2) return;
    let durum = Math.floor(Math.random() * 5);
    if (durum < 3) return;
    let xp = Math.floor(Math.random() * 5);
    let currentlyData = db.get("level.members." + message.author.id);
    if (!currentlyData) {
        db.set("level.members." + message.author.id, { Level: 0, XP: 0 });
        currentlyData = {
            Level: 0,
            XP: 0
        };
    }
    currentlyData.XP += xp;
    let nextLevel = getLevelExp(currentlyData.Level);
    if (nextLevel <= currentlyData.XP) {
        currentlyData.Level++;
        currentlyData.XP = 0;
        message.channel.send(
            `${message.author}, **tebrikler!** Seviye atladın ve **${currentlyData.Level}. seviyeye** ulaştın. 🎉🎉`
        );
        client.channels.cache.get(config.ranklog).send(`${message.author} Kişisi \`${currentlyData.Level - 1}\` seviyesinden \`${currentlyData.Level}\` seviyesine ulaştı`)
    }

  if (currentlyData.Level === 0) { await message.author.roles.add("verilcek rol"), await message.author.roles.remove("alıncak rol") } //readme yi oku kanka
  if (currentlyData.Level === 0) { await message.author.roles.add("verilcek rol"), await message.author.roles.remove("alıncak rol") } //readme yi oku kanka
  if (currentlyData.Level === 0) { await message.author.roles.add("verilcek rol"), await message.author.roles.remove("alıncak rol") } //readme yi oku kanka
  if (currentlyData.Level === 0) { await message.author.roles.add("verilcek rol"), await message.author.roles.remove("alıncak rol") } //readme yi oku kanka
  if (currentlyData.Level === 0) { await message.author.roles.add("verilcek rol"), await message.author.roles.remove("alıncak rol") } //readme yi oku kanka
  if (currentlyData.Level === 0) { await message.author.roles.add("verilcek rol"), await message.author.roles.remove("alıncak rol") } //readme yi oku kanka
  if (currentlyData.Level === 0) { await message.author.roles.add("verilcek rol"), await message.author.roles.remove("alıncak rol") } //readme yi oku kanka
  if (currentlyData.Level === 0) { await message.author.roles.add("verilcek rol"), await message.author.roles.remove("alıncak rol") } //readme yi oku kanka


    db.set("level.members." + message.author.id, currentlyData);
    sonMesaj[message.author.id] = Date.now();
});

function getLevelExp(level) {
    return 5 * Math.pow(level, 2) + 50 * level + 100;
}

function getLevelFromExp(exp) {
    let level = 0;

    while (exp >= getLevelExp(level)) {
        exp -= getLevelExp(level);
        level++;
    }

    return level;
}

function getLevelProgress(exp) {
    let level = 0;

    while (exp >= getLevelExp(level)) {
        exp -= getLevelExp(level);
        level++;
    }

    return exp;
}
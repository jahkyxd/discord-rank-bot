const Discord = require("discord.js");
const qdb = require("quick.db");
const kdb = new qdb.table("kullanici");
const adb = new qdb.table("ayarlar");
const db = new qdb.table("level");
const config = require("../config.json");
module.exports = {
    name: "level",
    aliases: ["seviye", "xp", "lvl", "rank"],
    run: async (client, message) => {
        let user = message.mentions.members.first() || message.member || message.guild.members.cache.get(args[0]);
        if (!user) return;
        let data = db.get("level.members");
        if (!data)
            data = db.set("level.members", {});
        let udata = data[user.id];
        if (!udata) {
            udata = db.set("level.members." + user.id, {
                Level: 0,
                XP: 0
            });
            udata = {
                Level: 0,
                XP: 0
            };
            data[user.id] = udata;
        }
        let sır = Object.keys(data);
        let sıralama = sır.sort((a, b) => (getLevelExp(data[b].Level) + data[b].XP) - (getLevelExp(data[a].Level) + data[a].XP)).indexOf(user.id) + 1;
        const embed = new Discord.MessageEmbed().setFooter(config.footer).setColor("#661c1c").setThumbnail(user.user.avatarURL({ dynamic: true, size: 2048 })).setAuthor(user.user.username, user.user.avatarURL({ dynamic: true, size: 2048 }));
        message.channel.send(embed
            .setDescription(`🔷 ${udata.Level}. seviye, ${udata.XP} tecrübe puanın var.`)
            .addField("Sıralama", `🔶 ${sıralama}/${sır.length}`, true)
            .addField("Sonraki Seviye", `🔹 ${udata.XP}/${getLevelExp(udata.Level++)} XP`, true))
    }
}

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

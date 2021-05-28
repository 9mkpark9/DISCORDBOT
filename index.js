
const Discord = require("discord.js")
const intent_list = new Discord.Intents(["GUILD_MEMBERS", "GUILD_MESSAGES", "GUILDS", "GUILD_INVITES"])
const client = new Discord.Client({ ws: { intents: intent_list } })
const { checkPermission, changeCommandStringLength, getEmbedFields, MessageSave } = require("./modules/utils.js")
const moment = require("moment")
require("moment-duration-format")
const momenttz = require("moment-timezone")
const token = process.argv.length == 2 ? process.env.token : ""; // heroku를 사용하지 않을꺼라면 const token = "디스코드 봇 토큰" 으로 바꿔주세요.
const welcomeChannelName = "어서오세요" // 입장 시 환영메시지를 전송 할 채널의 이름을 입력하세요.
const byeChannelName = "어서오세요" // 퇴장 시 메시지를 전송 할 채널의 이름을 입력하세요.
const welcomeChannelComment = "어서오세요." // 입장 시 전송할 환영메시지의 내용을 입력하세요.
const byeChannelComment = "안녕히가세요." // 퇴장 시 전송할 메시지의 내용을 입력하세요.
const roleName = "일반" // 입장 시 지급 할 역할의 이름을 적어주세요.

client.on("ready", () => {
  console.log("켰다.")
  client.user.setPresence({ activity: { name: "24시 대기중" }, status: "online" })
})

//
// 데이터베이스를 사용하지 않으신다면, // DATABASE 가 기입된 줄을 모두 지우시면 됩니다.
//
// 또, modules/utils.js 파일에서 DATABASE 라고 표시된 부분을 지워주시면 됩니다.
// 이후 18번 줄 에서 MessageSave 를 지워주시면 됩니다.

client.on("messageUpdate", (message) => { // DATABASE
  MessageSave(message, true) // DATABASE
}) // DATABASE

client.on("message", (message) => {
  MessageSave(message) // DATABASE
  if (message.author.bot) return

  if (message.content == "핑") {
    return message.reply("퐁")
  }

  if (message.content == "!si") {
    let embed = new Discord.MessageEmbed()
    let img = "https://cdn.discordapp.com/avatars/686674563823829106/44be1a483378549662a5f07a4f444a61.png?size=256"
    var duration = moment.duration(client.uptime).format(" D [일], H [시간], m [분], s [초]")
    embed.setColor("#186de6")
    embed.setAuthor("server info of 윤주영 BOT", img)
    embed.setFooter(`윤주영 BOT ❤️`)
    embed.addField("RAM usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    embed.addField("running time", `${duration}`, true)
    embed.addField("user", `${client.users.cache.size}`, true)
    embed.addField("server", `${client.guilds.cache.size}`, true)
    // embed.addField('channel',      `${client.channels.cache.size.toLocaleString()}`, true)
    embed.addField("Discord.js", `v${Discord.version}`, true)
    embed.addField("Node", `${process.version}`, true)

    let arr = client.guilds.cache.array()
    let list = ""
    list = `\`\`\`css\n`

    for (let i = 0; i < arr.length; i++) {
      // list += `${arr[i].name} - ${arr[i].id}\n`
      list += `${arr[i].name}\n`
    }
    list += `\`\`\`\n`
    embed.addField("list:", `${list}`)

    embed.setTimestamp()
    message.channel.send(embed)
  }

  if (message.content == "embed") {
    let img = "https://cdn.discordapp.com/avatars/686674563823829106/44be1a483378549662a5f07a4f444a61.png?size=256"
    let embed = new Discord.MessageEmbed()
      .setTitle("타이틀")
      .setURL("http://www.naver.com")
      .setAuthor("윤주영", img, "http://www.naver.com")
      .setThumbnail(img)
      .addField("Inline field title", "Some value here")
      .addField("Inline field title", "Some value here", true)
      .addField("Inline field title", "Some value here", true)
      .addField("Inline field title", "Some value here", true)
      .addField("Inline field title", "Some value here1\nSome value here2\nSome value here3\n")
      .setTimestamp()
      .setFooter("윤주영이 만듬", img)

    message.channel.send(embed)
  } else if (message.content == "!명령") {
    let helpImg = "https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png"
    let commandList = [
      { name: "!명령", desc: "명령" },
      { name: "핑", desc: "현재 핑 상태!" },
      { name: "embed", desc: "embed 예제1" },
      { name: "!전체공지", desc: "dm으로 전체 공지 보내기" },
      { name: "!전체공지2", desc: "dm으로 전체 embed 형식으로 공지 보내기" },
      { name: "!청소", desc: "텍스트 지움" },
      { name: "!초대코드", desc: "해당 채널의 초대 코드 표기" },
      { name: "!초대코드2", desc: "봇이 들어가있는 모든 채널의 초대 코드 표기" },
    ]
    let commandStr = ""
    let embed = new Discord.MessageEmbed().setAuthor("Help of 윤주영 BOT", helpImg).setColor("#186de6").setFooter(`윤주영 BOT ❤️`).setTimestamp()

    commandList.forEach((x) => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`
    })

    embed.addField("Commands: ", commandStr)

    message.channel.send(embed)
  } else if (message.content == "!초대코드2") {
    client.guilds.cache.array().forEach((x) => {
      x.channels.cache
        .find((x) => x.type == "text")
        .createInvite({ maxAge: 0 }) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
        .then((invite) => {
          message.channel.send(invite.url)
        })
        .catch((err) => {
          if (err.code == 50013) {
            message.channel.send(`**${x.channels.cache.find((x) => x.type == "text").guild.name}** 채널 권한이 없어 초대코드 발행 실패`)
          }
        })
    })
  } else if (message.content == "!초대코드") {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }
    message.guild.channels.cache
      .get(message.channel.id)
      .createInvite({ maxAge: 0 }) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
      .then((invite) => {
        message.channel.send(invite.url)
      })
      .catch((err) => {
        if (err.code == 50013) {
          message.channel.send(`**${message.guild.channels.cache.get(message.channel.id).guild.name}** 채널 권한이 없어 초대코드 발행 실패`)
        }
      })
  } else if (message.content.startsWith("!전체공지2")) {
    if (checkPermission(message)) return
    if (message.member != null) {
      // 채널에서 공지 쓸 때
      let contents = message.content.slice("!전체공지2".length)
      let embed = new Discord.MessageEmbed().setAuthor("공지 of 윤주영 BOT").setColor("#186de6").setFooter(`윤주영 BOT ❤️`).setTimestamp()

      embed.addField("공지: ", contents)

      message.member.guild.members.cache.array().forEach((x) => {
        if (x.user.bot) return
        x.user.send(embed)
      })

      return message.reply("공지를 전송했습니다.")
    } else {
      return message.reply("채널에서 실행해주세요.")
    }
  } else if (message.content.startsWith("!전체공지")) {
    if (checkPermission(message)) return
    if (message.member != null) {
      // 채널에서 공지 쓸 때
      let contents = message.content.slice("!전체공지".length)
      message.member.guild.members.cache.array().forEach((x) => {
        if (x.user.bot) return
        x.user.send(`<@${message.author.id}> ${contents}`)
      })

      return message.reply("공지를 전송했습니다.")
    } else {
      return message.reply("채널에서 실행해주세요.")
    }
  } else if (message.content.startsWith("!청소")) {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }

    if (message.channel.type != "dm" && checkPermission(message)) return

    var clearLine = message.content.slice("!청소 ".length)
    var isNum = !isNaN(clearLine)

    if (isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return
    } else if (!isNum) {
      // c @나긋해 3
      if (message.content.split("<@").length == 2) {
        if (isNaN(message.content.split(" ")[2])) return

        var user = message.content.split(" ")[1].split("<@!")[1].split(">")[0]
        var count = parseInt(message.content.split(" ")[2]) + 1
        let _cnt = 0

        message.channel.messages.fetch().then((collected) => {
          collected.every((msg) => {
            if (msg.author.id == user) {
              msg.delete()
              ++_cnt
            }
            return !(_cnt == count)
          })
        })
      }
    } else {
      message.channel
        .bulkDelete(parseInt(clearLine) + 1)
        .then(() => {
          message.channel.send(`<@${message.author.id}> ${parseInt(clearLine)} 개의 메시지를 삭제했습니다. (이 메시지는 잠시 후 사라집니다.)`).then((msg) => msg.delete({ timeout: 3000 }))
        })
        .catch(console.error)
    }
  }
})

client.login(token)

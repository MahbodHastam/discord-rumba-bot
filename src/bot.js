/**
 * Rumba bot
 * 
 * Author: Mahbod
 * Author Github: https://github.com/MahbodHastam
 */

require("dotenv").config()

const { Client } = require("discord.js")
const client = new Client()
const CMD_PREFIX = "."

const lyricsFinder = require("lyrics-finder")

const youtube_search = require("youtube-search")
const youtube_search_options = {
	maxResults: 1,
	key: process.env.GOOGLE_API_KEY,
}

const ytdl = require("ytdl-core")

client.on("message", async (message) => {
	try {
		if (message.author.bot) return null

		if (message.content.startsWith(CMD_PREFIX)) {
			const [CMD, ...args] = message.content
				.trim()
				.substring(CMD_PREFIX.length)
				.split(/\s+/)

			if (CMD === "find" || CMD === "f") {
				var searchWords = args.join(" ")
				;(async (artist, title) => {
					let lyrics = (await lyricsFinder(artist, title)) || false
					if (!lyrics) {
						message.reply(`"${title}" Not found :x: !`)
						message.react("❌")
					} else {
						message.react("✅")
						message.reply(`Results for "${searchWords}": `)
						message.reply(lyrics)
					}
				})("", searchWords)
			} else if (CMD === "help" || CMD === "h") {
				message.react("✅")
				message.reply(
					`\n:musical_note: Find lyrics: \n\`${CMD_PREFIX}f SONG NAME\`\n\n:play_pause: Play a music: \n\`${CMD_PREFIX}p SONG NAME\`\n\nDeveloper: \`Mahbod#1890\``
				)
			} else if (CMD === "play" || CMD === "p") {
				if (message.member.voice.channel) {
					var searchWords = args.join(" ")
					message.channel.send(`Searching for "${searchWords}"...`)
					youtube_search(
						searchWords,
						youtube_search_options,
						async (err, results) => {
							if (err) console.log(err)
							message.react("✅")
							const connection = message.member.voice.channel.join()
							message.channel.send(`Playing ${results[0].title}`)
							const dispatcher = (await connection).play(
								ytdl(results[0].link, { filter: "audioonly" }),
								{
									volume: 0.8,
								}
							)
						}
					)
				} else {
					message.react("❌")
					message.reply(":x: You need to join a voice channel first!")
				}
			} else if (CMD === "disconnect" || CMD === "dc") {
				message.member.voice.channel.leave()
				message.react("✅")
			}
		}
	} catch (error) {
		console.log(error)
	}
})

client.login(process.env.BOT_TOKEN)

import { Formatters, Message, MessageEmbed } from "discord.js";
import {inspect} from "util";
import { customClient } from "../index";

export async function cleanEval(message: Message, client: customClient) {
	let text = message.content.slice(`${client.prefix}eval`.length)
	let args : string[] |  string | null
	let result : any
	let fail: boolean = false
	let lang: string | null
	args = text.match(/```.*\s*.*\s*```/gs)
	if(args === null) return { content: "Please provide a valid code-block." }
	args = args[0].replace(/\s*```.*\s*/g, "")
	//@ts-ignore
	lang = text.match(/```.*\s*.+\s*```/gs)[0].match(/```.*/g) ? //@ts-ignore
		text.match(/```.*\s*.+\s*```/gs)[0].match(/```.*/g)[0].replace("```", "") //@ts-ignore
		: "js"

	try {
		result = inspect(eval(args), {depth: 1})
	} catch(e) {
		result = e
		fail = true
	}

	if (result.length > 1024){
		return { content: "Cannot return result as it is over 1,024 characters" }
	}
	else{
		let embed = new MessageEmbed()
			.setTitle('Results')
			.setDescription(Formatters.codeBlock('js', result))
			.setColor(fail ? "#ff0033" : "#8074d2")
			.setFooter({ text: `${client.user?.username} 1.0.0 by M1nx`})
		return {embeds: [embed]}
	}
}

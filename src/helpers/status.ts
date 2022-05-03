import { customClient } from '../index';

export function refreshStatus(client: customClient) {
  if (client.isReady()) {
    try {
      client.user.setActivity('for h!help', { type: 'WATCHING' });
    } catch (e) {}
  }
}

//const status = require('../data/status.json');

// let types = [
// 	"WATCHING"
// ]

// export function refreshStatus(client: customClient){
// 	let type = types[Math.floor(Math.random() * types.length)];
// 	let name = status[type][Math.floor(Math.random() * status[type].length)]
// 	if(client.isReady()){
// 		name = name
// 			.replace('{servers}', client.guilds.cache.size + `${client.guilds.cache.size === 1 ? ' server' : ' servers'}`)
// 			.replace('{members}', client.users.cache.size + `${client.users.cache.size === 1 ? ' member' : ' members'}`)
// 		try{ // @ts-ignore
// 			client.user.setActivity(name, {type: type})
// 		} catch (e) {}
// 	}
// }

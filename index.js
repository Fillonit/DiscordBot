const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, PresenceUpdateStatus, Partials, PermissionsBitField } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { TOKEN } = process.env;
const DisTube = require("distube").default;
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildModeration
    ],
    presence: {
        activities: [{ name: 'Streaming', type: ActivityType.Streaming, url: 'https://www.twitch.tv/yourchannel' }],
        status: 'online',
    },
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
client.cooldowns = new Collection();
const distube = new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [new YtDlpPlugin()]
});

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            if (typeof command.setDistube === 'function') {
                command.setDistube(distube);
            }
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// client.on('ready', () => {
//     console.log(`Ready! Logged in as ${client.user.tag}`);
//     client.user.setPresence({
//         activities: [{ name: 'Valorant', type: ActivityType.Competing, url: 'https://www.twitch.tv/yourchannel' }],
//         status: 'idle',
//     });
//     console.log(`Presence: ${client.user.presence.activities[0].name}`);
// });

client.login(TOKEN);
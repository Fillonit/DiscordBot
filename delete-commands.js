const { REST, Routes } = require('discord.js');
require('dotenv').config();
const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;

const rest = new REST().setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);

rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);
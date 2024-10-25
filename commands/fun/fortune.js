const { SlashCommandBuilder } = require('discord.js');

const fortunes = [
    "You will find great luck today.",
    "A friend will bring you some good news.",
    "Something unexpected will happen to you today.",
    "You will meet someone special.",
    "A new opportunity will present itself.",
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fortune')
        .setDescription('Get a fortune cookie message!'),
    async execute(interaction) {
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        await interaction.reply({ content: randomFortune, ephemeral: true });
    },
};

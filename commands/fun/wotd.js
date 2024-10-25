const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { WORDNIK_API_KEY } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wordoftheday')
        .setDescription('Get the word of the day along with its meaning!'),
    async execute(interaction) {
        const apiUrl = `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${WORDNIK_API_KEY}`;

        try {
            const response = await axios.get(apiUrl);
            const word = response.data.word;
            const definition = response.data.definitions[0].text;
            await interaction.reply({ content: `**Word of the Day:** ${word}\n**Definition:** ${definition}`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: 'Unable to fetch word of the day. Please try again later.', ephemeral: true });
        }
    },
};

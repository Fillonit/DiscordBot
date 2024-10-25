const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kanye")
        .setDescription("Get a random Kanye West quote"),
    async execute(interaction) {
        const apiUrl = "https://api.kanye.rest";

        try {
            const response = await axios.get(apiUrl);
            const quote = response.data.quote;
            await interaction.reply({ content: `🎤 Kanye says: "${quote}"`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the quote.', ephemeral: true });
        }
    },
};
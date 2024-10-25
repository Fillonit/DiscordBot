const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("animequote")
        .setDescription("Tells a random anime quote"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://animechan.io/api/v1/quotes/random");
            const quote = response.data;
            await interaction.reply({ content: `🎌 "${quote.data.content}" - ${quote.data.character.name} (${quote.data.anime.name})`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching an anime quote.", ephemeral: true });
        }
    },
};
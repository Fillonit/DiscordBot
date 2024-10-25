const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Sends a random cat picture"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://api.thecatapi.com/v1/images/search");
            const cat = response.data[0];
            await interaction.reply({ content: "🐱 Here's a random cat picture:", files: [cat.url], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a cat picture.", ephemeral: true });
        }
    },
};
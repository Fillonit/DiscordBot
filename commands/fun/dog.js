const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dog")
        .setDescription("Sends a random dog picture"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://dog.ceo/api/breeds/image/random");
            const dog = response.data;
            await interaction.reply({ content: "🐶 Here's a random dog picture:", files: [dog.message], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a dog picture.", ephemeral: true });
        }
    },
};
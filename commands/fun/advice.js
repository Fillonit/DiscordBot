const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("advice")
        .setDescription("Gives a random piece of advice"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://api.adviceslip.com/advice");
            const advice = response.data.slip.advice;
            await interaction.reply({ content: `💡 Here's a piece of advice: ${advice}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching advice.", ephemeral: true });
        }
    },
};
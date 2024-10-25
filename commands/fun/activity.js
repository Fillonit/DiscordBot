const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("randomactivity")
        .setDescription("Suggests a random activity to do"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://www.boredapi.com/api/activity");
            const activity = response.data.activity;
            await interaction.reply({ content: `🎲 How about this activity: ${activity}`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching an activity.", ephemeral: true });
        }
    },
};
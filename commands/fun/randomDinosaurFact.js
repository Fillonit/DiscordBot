const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dinofact")
        .setDescription("Tells a random dinosaur fact"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://dinosaur-facts-api.shultzlab.com/dinosaurs/random");
            const fact = response.data;
            await interaction.reply({ content: `🦖 ${fact.name}: ${fact.description}`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a dinosaur fact.", ephemeral: true });
        }
    },
};
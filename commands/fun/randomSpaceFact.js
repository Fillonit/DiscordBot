const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("spacefact")
        .setDescription("Tells a random space fact"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://api.le-systeme-solaire.net/rest/bodies/");
            const bodies = response.data.bodies;
            const body = bodies[Math.floor(Math.random() * bodies.length)];
            await interaction.reply({ content: `🌌 ${body.englishName}: ${body.isPlanet ? "Planet" : "Not a planet"}`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a space fact.", ephemeral: true });
        }
    },
};
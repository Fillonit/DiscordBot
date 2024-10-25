const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dadjoke")
        .setDescription("Tells a random dad joke"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://icanhazdadjoke.com/", {
                headers: { Accept: "application/json" }
            });
            const joke = response.data.joke;
            await interaction.reply({ content: `🤣 ${joke}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a dad joke.", ephemeral: true });
        }
    },
};
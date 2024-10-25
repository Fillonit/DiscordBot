const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("chucknorris")
        .setDescription("Tells a random Chuck Norris joke"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://api.chucknorris.io/jokes/random");
            const joke = response.data.value;
            await interaction.reply({ content: `🤣 ${joke}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a Chuck Norris joke.", ephemeral: true });
        }
    },
};
const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("prog-joke")
        .setDescription("Tells a random programming joke"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://official-joke-api.appspot.com/jokes/programming/random");
            const joke = response.data[0];
            await interaction.reply({ content: `💻 ${joke.setup}\n\n${joke.punchline}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a programming joke.", ephemeral: true });
        }
    },
};
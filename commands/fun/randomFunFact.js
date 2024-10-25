const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("funfact")
        .setDescription("Tells a random fun fact"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
            const fact = response.data.text;
            await interaction.reply({ content: `📚 Did you know? ${fact}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a fun fact.", ephemeral: true });
        }
    },
};
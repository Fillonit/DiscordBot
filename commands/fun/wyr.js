const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wouldyourather")
        .setDescription("Ask a 'Would You Rather' question")
        .addStringOption(option =>
            option.setName("rating")
                .setDescription("Choose the rating of the question")
                .setRequired(false)
                .addChoices(
                    { name: "PG", value: "pg" },
                    { name: "PG-13", value: "pg13" },
                    { name: "R", value: "r" }
                )),
    async execute(interaction) {
        const rating = interaction.options.getString("rating") || "pg13";

        const apiUrl = `https://api.truthordarebot.xyz/api/wyr?rating=${rating}`;

        try {
            const response = await axios.get(apiUrl);
            const question = response.data.question;
            await interaction.reply({ content: `🤔 ${question}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the question.', ephemeral: true });
        }
    },
};
const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("truthordare")
        .setDescription("Ask a truth or dare question")
        .addStringOption(option =>
            option.setName("choice")
                .setDescription("Choose truth or dare")
                .setRequired(true)
                .addChoices(
                    { name: "Truth", value: "truth" },
                    { name: "Dare", value: "dare" }
                ))
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
        const choice = interaction.options.getString("choice");
        const rating = interaction.options.getString("rating") || "pg13";

        const apiUrl = choice === "truth"
            ? `https://api.truthordarebot.xyz/v1/truth?rating=${rating}`
            : `https://api.truthordarebot.xyz/api/dare?rating=${rating}`;

        try {
            const response = await axios.get(apiUrl);
            const question = response.data.question;
            await interaction.reply({ content: `🎲 ${question}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the question.', ephemeral: true });
        }
    },
};
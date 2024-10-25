const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("numberfact")
        .setDescription("Get an interesting fact about a number")
        .addStringOption(option =>
            option.setName("type")
                .setDescription("The type of fact")
                .setRequired(true)
                .addChoices(
                    { name: "Math", value: "math" },
                    { name: "Trivia", value: "trivia" },
                    { name: "Date", value: "date" }
                ))
        .addStringOption(option =>
            option.setName("number")
                .setDescription("The number or date to get the fact about")
                .setRequired(true)),
    async execute(interaction) {
        const type = interaction.options.getString("type");
        const number = interaction.options.getString("number");

        const apiUrl = `http://numbersapi.com/${number}/${type}`;

        try {
            const response = await axios.get(apiUrl);
            const fact = response.data;
            await interaction.reply({ content: `📊 ${fact}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the fact.', ephemeral: true });
        }
    }
};
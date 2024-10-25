const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("word")
        .setDescription("Fetches information about a word")
        .addStringOption(option =>
            option.setName("word")
                .setDescription("The word to look up")
                .setRequired(true)),
    async execute(interaction) {
        const word = interaction.options.getString("word");
        const apiUrl = `https://www.wordsapi.com/mashape/words/${word}?when=2024-10-19T03:35:24.149Z&encrypted=${process.env.WORDS_API_KEY}`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    "Accept": "application/json"
                }
            });
            const wordData = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`Word Information: ${wordData.word}`)
                .setColor("#0099ff")
                .addFields(
                    { name: "Pronunciation", value: wordData.pronunciation.all || "N/A", inline: true },
                    { name: "Syllables", value: wordData.syllables.list.join(" - "), inline: true },
                    { name: "Frequency", value: wordData.frequency.toString(), inline: true }
                );

            const maxDefinitions = 5;
            wordData.results.slice(0, maxDefinitions).forEach((result, index) => {
                embed.addFields(
                    { name: `Definition ${index + 1}`, value: result.definition, inline: false },
                    { name: "Part of Speech", value: result.partOfSpeech, inline: true },
                    { name: "Synonyms", value: result.synonyms ? result.synonyms.join(", ") : "N/A", inline: true },
                    { name: "Examples", value: result.examples ? result.examples.join("; ") : "N/A", inline: false }
                );
            });

            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching the word information.", ephemeral: true });
        }
    },
};
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const categories = [
    { name: "Any Category", value: "any" },
    { name: "General Knowledge", value: "9" },
    { name: "Entertainment: Books", value: "10" },
    { name: "Entertainment: Film", value: "11" },
    { name: "Entertainment: Music", value: "12" },
    { name: "Entertainment: Musicals & Theatres", value: "13" },
    { name: "Entertainment: Television", value: "14" },
    { name: "Entertainment: Video Games", value: "15" },
    { name: "Entertainment: Board Games", value: "16" },
    { name: "Science & Nature", value: "17" },
    { name: "Science: Computers", value: "18" },
    { name: "Science: Mathematics", value: "19" },
    { name: "Mythology", value: "20" },
    { name: "Sports", value: "21" },
    { name: "Geography", value: "22" },
    { name: "History", value: "23" },
    { name: "Politics", value: "24" },
    { name: "Art", value: "25" },
    { name: "Celebrities", value: "26" },
    { name: "Animals", value: "27" },
    { name: "Vehicles", value: "28" },
    { name: "Entertainment: Comics", value: "29" },
    { name: "Science: Gadgets", value: "30" },
    { name: "Entertainment: Japanese Anime & Manga", value: "31" },
    { name: "Entertainment: Cartoon & Animations", value: "32" },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("trivia")
        .setDescription("Starts a trivia game")
        .addStringOption(option =>
            option.setName("category")
                .setDescription("Select the trivia category")
                .setRequired(true)
                .addChoices(categories.map(category => ({ name: category.name, value: category.value })))),
    async execute(interaction) {
        const category = interaction.options.getString("category");
        const apiUrl = category === "any"
            ? `https://opentdb.com/api.php?amount=1&type=multiple`
            : `https://opentdb.com/api.php?amount=1&type=multiple&category=${category}`;

        try {
            const response = await axios.get(apiUrl);
            const questionData = response.data.results[0];

            const options = [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5);

            const embed = new EmbedBuilder()
                .setTitle("Trivia Question")
                .setDescription(questionData.question)
                .setColor("#0DAF4C");

            const row = new ActionRowBuilder()
                .addComponents(
                    options.map((option, index) =>
                        new ButtonBuilder()
                            .setCustomId(`option_${index}`)
                            .setLabel(option)
                            .setStyle(ButtonStyle.Primary)
                    )
                );

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });

            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 30000 });

            collector.on('collect', async i => {
                if (i.customId.startsWith('option_')) {
                    const selectedOption = options[parseInt(i.customId.split('_')[1])];
                    if (selectedOption === questionData.correct_answer) {
                        await interaction.followUp({ content: `Correct! The answer is ${questionData.correct_answer}.`, ephemeral: false });
                    } else {
                        await interaction.followUp({ content: `Incorrect! The correct answer was ${questionData.correct_answer}.`, ephemeral: false });
                    }
                    collector.stop();
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({ content: `Time is up! The correct answer was ${questionData.correct_answer}.`, ephemeral: false });
                }
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the trivia question.', ephemeral: true });
        }
    },
};
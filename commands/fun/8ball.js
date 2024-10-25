const { SlashCommandBuilder } = require("discord.js");

const responses = [
    "Yes.",
    "No.",
    "Maybe.",
    "Ask again later.",
    "Definitely.",
    "I don't think so.",
    "Absolutely!",
    "Not in a million years.",
    "It is certain.",
    "Very doubtful.",
    "Without a doubt.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes, definitely.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Ask the magic 8-ball a question")
        .addStringOption(option =>
            option.setName("question")
                .setDescription("The question to ask the 8-ball")
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString("question");
        const response = responses[Math.floor(Math.random() * responses.length)];
        await interaction.reply({ content: `🎱 ${response}`, ephemeral: true });
    },
};
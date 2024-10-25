const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("insult")
        .setDescription("Tells a random insult")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user to insult")
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser("target") || interaction.user;

        try {
            const response = await axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json");
            const insult = response.data.insult;
            await interaction.reply({ content: `😈 ${targetUser}, ${insult}`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching an insult.", ephemeral: true });
        }
    },
};
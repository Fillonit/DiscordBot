const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("compliment")
        .setDescription("Tells a random compliment")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user to compliment")
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser("target") || interaction.user;

        try {
            const response = await axios.get("https://complimentr.com/api");
            const compliment = response.data.compliment;
            await interaction.reply({ content: `😊 ${targetUser}, ${compliment}`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a compliment.", ephemeral: true });
        }
    },
};
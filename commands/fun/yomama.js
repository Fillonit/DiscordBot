const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yomama")
        .setDescription("Tells a random Yo Mama joke")
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user to address the joke to")
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser("target") || interaction.user;

        try {
            const response = await axios.get("https://api.yomomma.info/");
            const joke = response.data.joke;
            await interaction.reply({ content: `🤣 ${targetUser}, ${joke}`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a Yo Mama joke.", ephemeral: true });
        }
    },
};
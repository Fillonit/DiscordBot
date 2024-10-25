const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("riddle")
        .setDescription("Tells a random riddle"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://riddles-api.vercel.app/random");
            const riddle = response.data;
            await interaction.reply({ content: `🧩 ${riddle.riddle}`, ephemeral: false });

            const filter = response => response.content.toLowerCase() === riddle.answer.toLowerCase();
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

            collector.on('collect', async response => {
                await interaction.followUp({ content: `Correct! The answer is ${riddle.answer}.`, ephemeral: false });
                collector.stop();
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp({ content: `Time is up! The correct answer was ${riddle.answer}.`, ephemeral: false });
                }
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a riddle.", ephemeral: true });
        }
    },
};
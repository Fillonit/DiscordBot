const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomduck')
        .setDescription('Get a random duck image'),
    async execute(interaction) {
        const apiUrl = 'https://random-d.uk/api/v2/random';

        try {
            const response = await axios.get(apiUrl);
            const duckImageUrl = response.data.url;

            const embed = new EmbedBuilder()
                .setTitle('Random Duck')
                .setImage(duckImageUrl)
                .setColor('#FFA500');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the duck image. Please try again later.', ephemeral: true });
        }
    },
};
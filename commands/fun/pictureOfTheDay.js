const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { NASA_API_KEY } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pictureoftheday')
        .setDescription('Get the picture of the day!'),
    async execute(interaction) {
        const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
        try {
            const response = await axios.get(apiUrl);
            const { title, date, explanation, url, hdurl, copyright } = response.data;

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(explanation)
                .setImage(hdurl || url)
                .setFooter({ text: `Date: ${date} ${copyright ? `| © ${copyright}` : ''}` })
                .setColor('#1E90FF');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Unable to fetch picture of the day. Please try again later.', ephemeral: true });
        }
    },
};
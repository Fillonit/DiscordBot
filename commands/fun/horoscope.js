const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('horoscope')
        .setDescription('Get today\'s horoscope for your zodiac sign')
        .addStringOption(option =>
            option.setName('sign')
                .setDescription('Your zodiac sign')
                .setRequired(true)
                .addChoices(
                    { name: 'Aries', value: 'Aries' },
                    { name: 'Taurus', value: 'Taurus' },
                    { name: 'Gemini', value: 'Gemini' },
                    { name: 'Cancer', value: 'Cancer' },
                    { name: 'Leo', value: 'Leo' },
                    { name: 'Virgo', value: 'Virgo' },
                    { name: 'Libra', value: 'Libra' },
                    { name: 'Scorpio', value: 'Scorpio' },
                    { name: 'Sagittarius', value: 'Sagittarius' },
                    { name: 'Capricorn', value: 'Capricorn' },
                    { name: 'Aquarius', value: 'Aquarius' },
                    { name: 'Pisces', value: 'Pisces' }
                )),
    async execute(interaction) {
        const sign = interaction.options.getString('sign');

        const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`;

        try {
            const response = await axios.get(apiUrl);
            const horoscope = response.data.horoscope_data;
            await interaction.reply({ content: horoscope, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Unable to fetch horoscope. Please try again later.', ephemeral: true });
        }
    },
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the current weather for a specified location')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('The location to get the weather for')
                .setRequired(true)),
    async execute(interaction) {
        const location = interaction.options.getString('location');
        const apiKey = process.env.WEATHER_API_KEY;
        const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

        try {
            const response = await axios.get(apiUrl);
            const weather = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`Weather in ${weather.location.name}`)
                .setDescription(weather.current.condition.text)
                .addFields(
                    { name: 'Temperature', value: `${weather.current.temp_c}°C`, inline: true },
                    { name: 'Humidity', value: `${weather.current.humidity}%`, inline: true },
                    { name: 'Wind Speed', value: `${weather.current.wind_kph} kph`, inline: true }
                )
                .setThumbnail(`http:${weather.current.condition.icon}`)
                .setColor('#00A2E8');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Sorry, I could not fetch the weather for that location.');
        }
    },
};
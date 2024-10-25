const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("convert")
        .setDescription("Converts currency values")
        .addNumberOption(option =>
            option.setName("amount")
                .setDescription("The amount to convert")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("from")
                .setDescription("The currency to convert from (e.g., USD)")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("to")
                .setDescription("The currency to convert to (e.g., EUR)")
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getNumber("amount");
        const fromCurrency = interaction.options.getString("from").toUpperCase();
        const toCurrency = interaction.options.getString("to").toUpperCase();
        const apiUrl = `https://open.er-api.com/v6/latest/${fromCurrency}`;

        try {
            const response = await axios.get(apiUrl);
            const rates = response.data.rates;
            const rate = rates[toCurrency];

            if (!rate) {
                return interaction.reply({ content: `Invalid target currency: ${toCurrency}`, ephemeral: true });
            }

            const convertedAmount = (amount * rate).toFixed(2);

            await interaction.reply({ content: `${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the conversion rate.', ephemeral: true });
        }
    },
};
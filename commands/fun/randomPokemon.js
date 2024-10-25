const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pokemon")
        .setDescription("Tells a random Pokemon"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
            const pokemons = response.data.results;
            const pokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
            await interaction.reply({ content: `🐾 ${pokemon.name}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a Pokemon.", ephemeral: true });
        }
    },
};
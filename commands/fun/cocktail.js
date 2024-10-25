const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cocktail")
        .setDescription("Tells a random cocktail recipe"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
            const cocktail = response.data.drinks[0];

            const ingredients = [];
            for (let i = 1; i <= 15; i++) {
                const ingredient = cocktail[`strIngredient${i}`];
                const measure = cocktail[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== "") {
                    ingredients.push(`${measure ? measure : ""} ${ingredient}`);
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(`🍹 ${cocktail.strDrink}`)
                .setDescription(cocktail.strInstructions)
                .addFields({ name: "Ingredients", value: ingredients.join("\n") })
                .setColor("#0099ff")
                .setImage(cocktail.strDrinkThumb);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a cocktail recipe.", ephemeral: true });
        }
    },
};
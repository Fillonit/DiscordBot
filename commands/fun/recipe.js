const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("recipe")
        .setDescription("Tells a random food recipe"),
    async execute(interaction) {
        try {
            const response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
            const recipe = response.data.meals[0];

            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = recipe[`strIngredient${i}`];
                const measure = recipe[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== "") {
                    ingredients.push(`${measure} ${ingredient}`);
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(`🍽️ ${recipe.strMeal}`)
                .setDescription(recipe.strInstructions)
                .addFields({ name: "Ingredients", value: ingredients.join("\n") })
                .setColor("#0099ff")
                .setImage(recipe.strMealThumb);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error fetching a food recipe.", ephemeral: true });
        }
    },
};
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("searchproducts")
        .setDescription("Search for products on Gjirafa50 or Foleja")
        .addStringOption(option =>
            option.setName("store")
                .setDescription("Select the store")
                .setRequired(true)
                .addChoices(
                    { name: "Gjirafa50", value: "gjirafa50" },
                    { name: "Foleja", value: "foleja" }
                ))
        .addStringOption(option =>
            option.setName("search")
                .setDescription("Search term")
                .setRequired(true)),
    async execute(interaction) {
        const store = interaction.options.getString("store");
        const searchTerm = interaction.options.getString("search");
        const apiUrl = store === "gjirafa50"
            ? `https://job-scraper.shuttleapp.rs/api/search_gjirafa50_products?search=${searchTerm}`
            : `https://job-scraper.shuttleapp.rs/api/search_foleja_products?search=${searchTerm}`;

        try {
            const response = await axios.get(apiUrl);
            const products = response.data;

            if (products.length === 0) {
                return interaction.reply("No products found.");
            }

            let currentPage = 1;
            const totalPages = products.length;

            const generateEmbed = (page) => {
                const product = products[page - 1];
                const price = store === "gjirafa50" ? product.current_price.text : `${product.current_price} €`;
                const previousPrice = store === "gjirafa50" && product.previous_price ? product.previous_price.text : product.previous_price ? `${product.previous_price} €` : 'N/A';
                const discount = store === "gjirafa50" ? product.sale_percentage : product.discount;
                let imageUrl = store === "gjirafa50" ? product.image_url : product.image;

                if (!imageUrl.startsWith('http')) {
                    imageUrl = `https://www.${store}.com${imageUrl}`;
                }

                const embed = new EmbedBuilder()
                    .setTitle(product.title)
                    .setURL(product.link)
                    .setColor('#0DAF4C')
                    .setFooter({ text: `Page ${page} of ${totalPages}` })
                    .setImage(imageUrl)
                    .addFields(
                        { name: "Price", value: price, inline: true },
                        { name: "Previous Price", value: previousPrice, inline: true },
                        { name: "Discount", value: discount, inline: true }
                    );

                return embed;
            };

            const generateButtons = (page) => {
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === 1),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === totalPages)
                    );
            };

            const message = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [generateButtons(currentPage)], fetchReply: true });

            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: 'You cannot use these buttons.', ephemeral: true });
                }

                if (i.customId === 'prev' && currentPage > 1) {
                    currentPage--;
                } else if (i.customId === 'next' && currentPage < totalPages) {
                    currentPage++;
                }

                await i.update({ embeds: [generateEmbed(currentPage)], components: [generateButtons(currentPage)] });
            });

            collector.on('end', async () => {
                const disabledRow = generateButtons(currentPage);
                disabledRow.components.forEach(button => button.setDisabled(true));
                try {
                    await message.edit({ components: [disabledRow] });
                } catch (error) {
                    console.error('Failed to edit message:', error);
                }
            });
        } catch (error) {
            console.error(error);
            await interaction.reply("There was an error fetching the products.");
        }
    },
};
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveaways")
        .setDescription("Fetch current giveaways")
        .addStringOption(option =>
            option.setName("platform")
                .setDescription("Filter by platform")
                .setRequired(false)
                .addChoices(
                    { name: 'PC', value: 'pc' },
                    { name: 'Steam', value: 'steam' },
                    { name: 'Epic Games Store', value: 'epic-games-store' },
                    { name: 'Ubisoft', value: 'ubisoft' },
                    { name: 'GOG', value: 'gog' },
                    { name: 'itch.io', value: 'itchio' },
                    { name: 'PS4', value: 'ps4' },
                    { name: 'PS5', value: 'ps5' },
                    { name: 'Xbox One', value: 'xbox-one' },
                    { name: 'Xbox Series X|S', value: 'xbox-series-xs' },
                    { name: 'Switch', value: 'switch' },
                    { name: 'Android', value: 'android' },
                    { name: 'iOS', value: 'ios' },
                    { name: 'VR', value: 'vr' },
                    { name: 'Battle.net', value: 'battlenet' },
                    { name: 'Origin', value: 'origin' },
                    { name: 'DRM-Free', value: 'drm-free' },
                    { name: 'Xbox 360', value: 'xbox-360' }
                ))
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Filter by giveaway type")
                .setRequired(false)
                .addChoices(
                    { name: 'Game', value: 'game' },
                    { name: 'Loot', value: 'loot' },
                    { name: 'Beta', value: 'beta' }
                ))
        .addStringOption(option =>
            option.setName("sort-by")
                .setDescription("Sort by date, value, or popularity")
                .setRequired(false)
                .addChoices(
                    { name: 'Date', value: 'date' },
                    { name: 'Value', value: 'value' },
                    { name: 'Popularity', value: 'popularity' }
                )),
    async execute(interaction) {
        const platform = interaction.options.getString("platform");
        const type = interaction.options.getString("type");
        const sortBy = interaction.options.getString("sort-by");

        let apiUrl = 'https://www.gamerpower.com/api/giveaways';

        const params = [];
        if (platform) params.push(`platform=${platform}`);
        if (type) params.push(`type=${type}`);
        if (sortBy) params.push(`sort-by=${sortBy}`);
        if (params.length > 0) apiUrl += `?${params.join('&')}`;

        try {
            const response = await axios.get(apiUrl);
            const giveaways = response.data;

            if (giveaways.length === 0) {
                return interaction.reply("No giveaways found.");
            }

            let currentPage = 1;
            const totalPages = giveaways.length;

            const generateEmbed = (page) => {
                const giveaway = giveaways[page - 1];

                const endDate = giveaway.end_date !== "N/A" ? `<t:${Math.floor(new Date(giveaway.end_date).getTime() / 1000)}:R>` : "N/A";

                const instructions = giveaway.instructions
                    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
                    .replace(/\r\n/g, '\n');

                const embed = new EmbedBuilder()
                    .setTitle(giveaway.title)
                    .setURL(giveaway.open_giveaway_url)
                    .setColor('#FF4500')
                    .setDescription(giveaway.description)
                    .setThumbnail(giveaway.thumbnail)
                    .setImage(giveaway.image)
                    .addFields(
                        { name: "Worth", value: giveaway.worth, inline: true },
                        { name: "Type", value: giveaway.type, inline: true },
                        { name: "Platforms", value: giveaway.platforms, inline: true },
                        { name: "End Date", value: endDate, inline: true },
                        { name: "Status", value: giveaway.status, inline: true },
                        { name: "Users", value: giveaway.users.toString(), inline: true },
                        { name: "Instructions", value: instructions, inline: false }
                    )
                    .setFooter({ text: `Page ${page} of ${totalPages}` });

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

            const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 90000 });

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

            collector.on('end', () => {
                const disabledRow = generateButtons(currentPage);
                disabledRow.components.forEach(button => button.setDisabled(true));
                message.edit({ components: [disabledRow] });
            });
        } catch (error) {
            console.error(error);
            await interaction.reply("There was an error fetching the giveaways.");
        }
    },
};
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const axios = require("axios");

function formatCompanyName(companyName) {
    return companyName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getjobs")
        .setDescription("Fetch jobs from selected portal")
        .addStringOption((option) =>
            option
                .setName("portal")
                .setDescription("Select the job portal")
                .setRequired(true)
                .addChoices(
                    { name: "Portal Pune", value: "portal_pune" },
                    { name: "KosovaJobs", value: "kosovajobs" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("industry")
                .setDescription("Select the job industry")
                .setRequired(false)
                .addChoices(
                    { name: "Administratë", value: "1" },
                    { name: "Arkitekturë", value: "40" },
                    { name: "Art dhe Kulturë", value: "3" },
                    { name: "Banka", value: "4" },
                    { name: "Industria Automobilistike", value: "5" },
                    { name: "Retail dhe Distribuim", value: "7" },
                    { name: "Ndërtimtari & Patundshmëri", value: "8" },
                    { name: "Mbështetje e Konsumatorëve, Call Center", value: "9" },
                    { name: "Ekonomi, Financë, Kontabilitet", value: "10" },
                    { name: "Edukim, Shkencë & Hulumtim", value: "11" },
                    { name: "Burime Njerëzore", value: "14" },
                    { name: "Teknologji e Informacionit", value: "15" },
                    { name: "Gazetari, Shtyp & Media", value: "17" },
                    { name: "Ligj & Legjislacion", value: "18" },
                    { name: "Menaxhment", value: "20" },
                    { name: "Marketing, Reklamim & PR", value: "21" },
                    { name: "Inxhinieri", value: "22" },
                    { name: "Shëndetësi, Medicinë", value: "23" },
                    { name: "Menaxhment Ekzekutiv", value: "34" },
                    { name: "Gastronomi, Hoteleri, Turizëm", value: "35" },
                    { name: "Përkthim, Interpretim", value: "36" }
                )
        )
        .addBooleanOption((option) =>
            option
                .setName("ephemeral")
                .setDescription("Whether the response should be ephemeral")
        ),
    async execute(interaction) {
        const selectedPortal = interaction.options.getString("portal");
        const selectedIndustry = interaction.options.getString("industry");
        const apiUrl = `https://job-scraper.shuttleapp.rs/api/${selectedIndustry ? "search_jobs" : "get_jobs"}/${selectedPortal}${selectedIndustry ? `?jobIndustry=${selectedIndustry}` : ""}`;

        try {
            const response = await axios.get(apiUrl);
            const jobs = response.data;

            if (jobs.length === 0) {
                return interaction.reply("No jobs found.");
            }

            let currentPage = 1;
            const totalPages = jobs.length;

            const generateEmbed = (page) => {
                const job = jobs[page - 1];

                const embed = new EmbedBuilder()
                    // .setTitle(job.title)
                    .setURL(job.link)
                    .setColor('#0DAF4C')
                    // .setTimestamp()
                    // .setImage(job.company.logo)
                    .setAuthor({ name: formatCompanyName(job.company.name), iconURL: job.company.logo, url: job.link })
                    // .setURL("https://job-seeker.fillonit.tech/")
                    .setFooter({ text: `Page ${page} of ${totalPages}\njob-seeker.fillonit.tech` })
                    .addFields(
                        { name: "Company", value: formatCompanyName(job.company.name), inline: false },
                        { name: "Location", value: job.location, inline: false },
                        { name: "Expiry", value: `${job.expiry} days`, inline: false },
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

            const message = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [generateButtons(currentPage)], fetchReply: true, ephemeral: interaction.options.getBoolean("ephemeral") });

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

            collector.on('end', () => {
                const disabledRow = generateButtons(currentPage);
                disabledRow.components.forEach(button => button.setDisabled(true));
                message.edit({ components: [disabledRow] });
            });
        } catch (error) {
            console.error(error);
            await interaction.reply("There was an error fetching the jobs.");
        }
    },
};
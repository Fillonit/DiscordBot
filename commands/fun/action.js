const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

let availableReactions = [];

async function fetchReactions() {
    try {
        const response = await axios.get('https://api.otakugifs.xyz/gif/allreactions');
        availableReactions = response.data.reactions;
    } catch (error) {
        console.error('Error fetching reactions:', error);
    }
}

fetchReactions();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('action')
        .setDescription('Perform an action and mention another user')
        .addStringOption(option =>
            option.setName('reaction')
                .setDescription('The action to perform')
                .setRequired(true)
                .addChoices(
                    availableReactions.map(reaction => ({ name: reaction, value: reaction }))
                ))
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to mention')
                .setRequired(true)),
    async execute(interaction) {
        const reaction = interaction.options.getString('reaction');
        const targetUser = interaction.options.getUser('target');

        try {
            const response = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${reaction}&format=gif`);
            const imageUrl = response.data.url;

            await interaction.reply({ content: `${interaction.user} ${reaction}s ${targetUser}`, files: [imageUrl] });
        } catch (error) {
            console.error('Error fetching image:', error);
            await interaction.reply({ content: 'There was an error fetching the image. Please try again later.', ephemeral: true });
        }
    },
};
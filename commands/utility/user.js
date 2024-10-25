const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Provides information about a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const targetMember = interaction.guild.members.cache.get(targetUser.id);

        const embed = new EmbedBuilder()
            .setTitle('User Information')
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setColor('#0099ff')
            .addFields(
                { name: 'Username', value: targetUser.username, inline: true },
                { name: 'ID', value: targetUser.id, inline: true },
                { name: 'Joined Server', value: targetMember.joinedAt.toDateString(), inline: true },
                { name: 'Account Created', value: targetUser.createdAt.toDateString(), inline: true },
                { name: 'Roles', value: targetMember.roles.cache.map(role => role.name).join(', '), inline: false }
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
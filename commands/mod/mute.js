const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of the mute in minutes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the mute')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const duration = interaction.options.getInteger('duration');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({
                content: 'That user is not in this server.',
                ephemeral: true
            });
        }

        let muteRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'mute');

        if (!muteRole) {
            try {
                muteRole = await interaction.guild.roles.create({
                    name: 'Mute',
                    color: '#000000',
                    permissions: new PermissionsBitField(),
                    reason: 'Mute role needed for muting users'
                });

                interaction.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.create(muteRole, {
                        SEND_MESSAGES: false,
                        SPEAK: false,
                        CONNECT: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch (error) {
                console.error('Error creating mute role:', error);
                return interaction.reply({
                    content: 'There was an error creating the mute role.',
                    ephemeral: true
                });
            }
        }

        try {
            await member.roles.add(muteRole);
            interaction.reply({
                content: `${user.tag} has been muted for ${duration} minutes. Reason: ${reason}`,
                ephemeral: true
            });

            setTimeout(async () => {
                try {
                    await member.roles.remove(muteRole);
                    interaction.followUp({
                        content: `${user.tag} has been unmuted.`,
                        ephemeral: true
                    });
                } catch (error) {
                    console.error('Error removing mute role:', error);
                }
            }, duration * 60 * 1000);
        } catch (error) {
            console.error('Error adding mute role:', error);
            interaction.reply({
                content: 'There was an error muting the user.',
                ephemeral: true
            });
        }
    },
};
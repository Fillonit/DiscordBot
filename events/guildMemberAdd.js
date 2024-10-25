const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.GuildMemberAdd,
    execute(member) {
        console.log(`Member joined: ${member.user.tag}`);

        const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
        if (!channel) return;

        channel.send(`Welcome to the server, ${member}!`);

        const role = member.guild.roles.cache.find(role => role.name === 'Member');
        if (!role) return;

        member.roles.add({
            role,
            reason: 'User joined the server',
        });

        console.log(`Added role to ${member.user.tag}`);

        const user = member.user;
        user.send(`Welcome to the server, ${user}!`);
    }
};

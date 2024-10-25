const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("remindme")
        .setDescription("Sets a reminder")
        .addIntegerOption(option =>
            option.setName("time")
                .setDescription("The time in minutes after which to send the reminder")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("message")
                .setDescription("The reminder message")
                .setRequired(true)),
    async execute(interaction) {
        const time = interaction.options.getInteger("time");
        const message = interaction.options.getString("message");

        await interaction.reply({ content: `Reminder set for ${time} minutes.`, ephemeral: true });

        setTimeout(async () => {
            try {
                await interaction.followUp({ content: `⏰ Reminder: ${message}`, ephemeral: true });
            } catch (error) {
                console.error('Error sending reminder:', error);
            }
        }, time * 60 * 1000);
    },
};
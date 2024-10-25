const { SlashCommandBuilder } = require('@discordjs/builders');
const dotenv = require('dotenv');
dotenv.config();
const { OWNER_ID } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates JavaScript code')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The code to evaluate')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Whether the response should be ephemeral')),
    async execute(interaction) {
        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const code = interaction.options.getString('code');
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

        try {
            let evaled = eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }

            await interaction.reply({ content: `\`\`\`js\n${evaled}\n\`\`\``, ephemeral });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `\`\`\`js\n${error}\n\`\`\``, ephemeral });
        }
    },
};
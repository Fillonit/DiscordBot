const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomharrypotter')
        .setDescription('Get a random Harry Potter character'),
    async execute(interaction) {
        const apiUrl = 'https://hp-api.onrender.com/api/characters';

        try {
            const response = await axios.get(apiUrl);
            const characters = response.data;
            const top100 = characters.slice(0, 100);
            // const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
            const randomCharacter = top100[Math.floor(Math.random() * top100.length)];

            const embed = new EmbedBuilder()
                .setTitle(randomCharacter.name)
                .setDescription(`House: ${randomCharacter.house || 'Unknown'}`)
                .addFields(
                    { name: 'Species', value: randomCharacter.species || 'Unknown', inline: true },
                    { name: 'Gender', value: randomCharacter.gender || 'Unknown', inline: true },
                    { name: 'Date of Birth', value: randomCharacter.dateOfBirth || 'Unknown', inline: true },
                    { name: 'Ancestry', value: randomCharacter.ancestry || 'Unknown', inline: true },
                    { name: 'Eye Colour', value: randomCharacter.eyeColour || 'Unknown', inline: true },
                    { name: 'Hair Colour', value: randomCharacter.hairColour || 'Unknown', inline: true },
                    { name: 'Patronus', value: randomCharacter.patronus || 'Unknown', inline: true },
                    { name: 'Actor', value: randomCharacter.actor || 'Unknown', inline: true },
                    { name: 'Hogwarts Student', value: randomCharacter.hogwartsStudent ? 'Yes' : 'No', inline: true },
                    { name: 'Hogwarts Staff', value: randomCharacter.hogwartsStaff ? 'Yes' : 'No', inline: true },
                    { name: 'Alive', value: randomCharacter.alive ? 'Yes' : 'No', inline: true }
                )
                .setThumbnail(randomCharacter.image || 'https://via.placeholder.com/150')
                .setColor('#4A90E2');

            if (randomCharacter.alternate_names && randomCharacter.alternate_names.length > 0) {
                embed.addFields({ name: 'Alternate Names', value: randomCharacter.alternate_names.join(', '), inline: false });
            }

            if (randomCharacter.wand) {
                embed.addFields({
                    name: 'Wand',
                    value: `Wood: ${randomCharacter.wand.wood || 'Unknown'}, Core: ${randomCharacter.wand.core || 'Unknown'}, Length: ${randomCharacter.wand.length || 'Unknown'} inches`,
                    inline: false
                });
            }

            await interaction.reply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the character information. Please try again later.', ephemeral: true });
        }
    },
};
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { DisTube } = require("distube");
const Youtube = require("youtube-search-api");

let distube;

function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
}

function createActionRow(isPaused) {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pause')
                .setLabel('Pause')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(isPaused),
            new ButtonBuilder()
                .setCustomId('resume')
                .setLabel('Resume')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(!isPaused),
            new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('Stop')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('volume_up')
                .setLabel('Volume Up')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('volume_down')
                .setLabel('Volume Down')
                .setStyle(ButtonStyle.Success)
        );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song from a YouTube URL or searches by name")
        .addStringOption(option =>
            option.setName("url")
                .setDescription("The YouTube URL of the song to play")
                .setRequired(false))
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the song to search for")
                .setRequired(false)),
    async execute(interaction) {
        if (!distube) {
            return interaction.reply({ content: "DisTube is not initialized!", ephemeral: true });
        }

        const url = interaction.options.getString("url");
        const name = interaction.options.getString("name");
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: "You need to be in a voice channel to play music!", ephemeral: true });
        }

        if (!url && !name) {
            return interaction.reply({ content: "Please provide a YouTube URL or a song name to search for.", ephemeral: true });
        }

        if (url && !isValidYouTubeUrl(url)) {
            return interaction.reply({ content: "Please provide a valid YouTube URL.", ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            let playUrl = url;

            if (!url && name) {
                console.log('Searching for song:', name);
                const searchResults = await Youtube.GetListByKeyword(name, false, 1);
                if (searchResults.items.length === 0) {
                    throw new Error('No results found');
                }
                playUrl = `https://www.youtube.com/watch?v=${searchResults.items[0].id}`;
                console.log('Playing URL:', playUrl);
            }

            const message = await interaction.followUp({
                content: `Now playing: ${playUrl}\nControl the music:`,
                components: [createActionRow(false)],
                ephemeral: true
            });

            const filter = i => i.user.id === interaction.user.id;
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (i) => {
                const queue = distube.getQueue(voiceChannel);

                if (!queue) {
                    return i.reply({ content: "There is no music playing currently!", ephemeral: true });
                }

                let isPaused = queue.paused;

                try {
                    switch (i.customId) {
                        case 'pause':
                            queue.pause();
                            isPaused = true;
                            break;
                        case 'resume':
                            queue.resume();
                            isPaused = false;
                            break;
                        case 'stop':
                            queue.stop();
                            await i.update({ content: 'Music stopped', components: [] });
                            collector.stop();
                            return;
                        case 'volume_up':
                            queue.setVolume(Math.min(queue.volume + 10, 100));
                            await i.reply({ content: `Volume increased to ${queue.volume}`, ephemeral: true });
                            return;
                        case 'volume_down':
                            queue.setVolume(Math.max(queue.volume - 10, 0));
                            await i.reply({ content: `Volume decreased to ${queue.volume}`, ephemeral: true });
                            return;
                    }
                    await i.update({ content: `Music ${isPaused ? 'paused' : 'resumed'}`, components: [createActionRow(isPaused)] });
                } catch (error) {
                    console.error('Button interaction error:', error);
                    await i.reply({ content: 'An error occurred while interacting with the music controls.', ephemeral: true });
                }
            });

            collector.on('end', async () => {
                try {
                    const disabledRow = createActionRow(true);
                    await message.edit({ components: [disabledRow] });
                } catch (error) {
                    console.error('Error editing message on collector end:', error);
                }
            });
        } catch (error) {
            console.error('Error:', error);
            await interaction.followUp({ content: 'There was an error playing the audio. Please try again with a different URL or song name.', ephemeral: true });
        }
    },
    setDistube(d) {
        distube = d;
    },
};

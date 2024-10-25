const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    // once: false,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        if (!client.user) {
            console.error("Client user is not defined.");
            return;
        }

        if (typeof client.user.setPresence !== "function") {
            console.error("setPresence method is not available.");
            return;
        }

        try {
            client.user.setPresence({
                activities: [
                    {
                        name: "CHROMAKOPIA",
                        type: ActivityType.Listening,
                        state: "Tyler, The Creator",
                        url: "https://open.spotify.com/artist/4V8LLVI7PbaPR0K2TGSxFF?si=J-DxqxtqTf-bOw1r6LJeQw",
                    },
                ],
                since: 1729173029,
                status: "dnd",
            });
            console.log("Presence set successfully.");
        } catch (error) {
            console.error("Error setting presence:", error);
        }
    },
};

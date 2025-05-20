/*
 * SapphireClient
 *
 * This is a version of the Sapphire Discord Client changed by myself, with some personal tweaks.
 */

import { SapphireClient } from "@sapphire/framework";
import { REST, Routes, GatewayIntentBits, Partials } from "discord.js";

export class Client extends SapphireClient {
    /* Public Variables */
    private AppToken: string;
    public AppId: string;

    /* Constructor */
    constructor(config: { token: string; clientid: string }) {
        super({
            intents: Object.keys(GatewayIntentBits) as Array<any>,
            partials: Object.keys(Partials) as Array<any>,
        });

        this.AppToken = config.token;
        this.AppId = config.clientid;
    }

    /** Starts the bot's client, connecting to the Discord API. */
    public async Connect() {
        try {
            await this.login(this.AppToken);
            return this;
        } catch (e) {
            return null;
        }
    }

    /** Clears all global application commands linked to the bot. */
    public async ClearGlobalCommands() {
        const restAPI = new REST().setToken(this.AppToken);

        try {
            await restAPI.put(Routes.applicationCommands(this.AppId), {
                body: [],
            });

            console.log("Successfully deleted all application commands.");
        } catch (e) {
            return null;
        }
    }
}

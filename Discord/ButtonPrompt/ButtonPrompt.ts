/*
 * ButtonPrompt
 *
 * This utility is used to easily create component collectors in Discord.JS using TypeScript.
 */

import type { Message, ButtonInteraction } from "discord.js";

/**
 * Creates a new button prompt object.
 *
 * @param   interactionMessage  The message that has the components.
 * @param expectedComponentIds The component IDs in an array that can be interacted with.
 * @param expectedUserIds (OPTIONAL) The User IDs in an array that can interact with the components.
 * @param collectorTimeout (OPTIONAL) The collector timeout in milliseconds.
 * 
 * @example
 * ```typescript
        // Create Prompt & Await
        const buttonPrompt = new ButtonPrompt({
            interactionMessage: componentMessage,
            expectedComponentIds: [
                "TEST_BUTTON_DECLINE",
                "TEST_BUTTON_CONFIRM",
            ],
        })
        
        // Await Prompt
        const myPrompt = await buttonPrompt.AwaitPrompt();

        // Prompt Timeout
        if(!myPrompt) {
            return console.log("Prompt timed out.")
        }

        // Prompt Responded
        return console.log("Interaction successfully received: " + myPrompt.customId)
    ```
 */
export class ButtonPrompt {
    /* Private Variables */
    private interactionMessage: Message;
    private expectedComponentIds: Array<string>;
    private expectedUserIds: Array<string> | undefined;
    private collectorTimeout: number | undefined;

    public promptInteraction: ButtonInteraction | undefined;

    /* Constructor */
    constructor(config: {
        interactionMessage: Message;
        expectedComponentIds: Array<string>;
        expectedUserIds?: Array<string>;
        collectorTimeout?: number;
        interactionReply?: boolean;
    }) {
        this.interactionMessage = config.interactionMessage;
        this.expectedComponentIds = config.expectedComponentIds;
        this.expectedUserIds = config.expectedUserIds;
        this.collectorTimeout = config.collectorTimeout;
    }

    /**
     * Await Prompt
     *
     * Will start the prompt collector.
     */
    public AwaitPrompt = async (): Promise<ButtonInteraction | null> => {
        try {
            const buttonFilter = (i: ButtonInteraction) =>
                this.expectedComponentIds.includes(i.customId) &&
                (this.expectedUserIds?.includes(i.user.id) ?? true);

            const buttonInteraction =
                (await this.interactionMessage.awaitMessageComponent({
                    filter: buttonFilter as any,
                    time: this.collectorTimeout ? this.collectorTimeout : 15000,
                })) as ButtonInteraction;
            this.promptInteraction = buttonInteraction;

            return buttonInteraction;
        } catch (e) {
            return null;
        }
    };
}

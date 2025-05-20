// Dependencies
import { Command } from "@sapphire/framework";
import {
    type ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} from "discord.js";

// Functions
import { ButtonPrompt } from "@utils/ButtonPrompt";

export default class extends Command {
    /** Constructor */
    public constructor(
        context: Command.LoaderContext,
        options: Command.Options
    ) {
        super(context, { ...options });
    }

    /** Register Command */
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName("prompt").setDescription("Start a button prompt.")
        );
    }

    /** Chat Input Run */
    public async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        // Create Embed
        const promptEmbed = new EmbedBuilder()
            .setTitle(null)
            .setColor("Blurple")
            .setDescription("A totally not suspicious testing command.");

        // Create Buttons
        const declineButton = new ButtonBuilder()
            .setCustomId("TEST_BUTTON_DECLINE")
            .setLabel("Decline")
            .setStyle(ButtonStyle.Danger);
        const confirmButton = new ButtonBuilder()
            .setCustomId("TEST_BUTTON_CONFIRM")
            .setLabel("Confirm")
            .setStyle(ButtonStyle.Success);
        const buttonsActionRow =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                declineButton,
                confirmButton
            );

        // Send Prompt Message
        const componentMessage = await interaction.editReply({
            embeds: [promptEmbed],
            components: [buttonsActionRow],
        });

        // Create Prompt & Await
        const buttonPrompt = await new ButtonPrompt({
            interactionMessage: componentMessage,
            expectedComponentIds: [
                "TEST_BUTTON_DECLINE",
                "TEST_BUTTON_CONFIRM",
            ],
        }).AwaitPrompt();

        // Prompt Timeout
        if (!buttonPrompt) {
            const timeoutEmbed = EmbedBuilder.from(componentMessage.embeds[0])
                .setColor("Orange")
                .setDescription("The prompt has expired.");
            return await componentMessage.edit({
                embeds: [timeoutEmbed],
                components: [],
            });
        }

        // Prompt Response
        switch (buttonPrompt.customId) {
            case "TEST_BUTTON_DECLINE": {
                const declineEmbed = EmbedBuilder.from(
                    componentMessage.embeds[0]
                )
                    .setColor(0xff0000)
                    .setDescription("Successfully declined the prompt.");
                return await componentMessage.edit({
                    embeds: [declineEmbed],
                    components: [],
                });
            }

            case "TEST_BUTTON_CONFIRM": {
                const confirmEmbed = EmbedBuilder.from(
                    componentMessage.embeds[0]
                )
                    .setColor(0x00ff00)
                    .setDescription("Successfully confirmed the prompt.");
                return await componentMessage.edit({
                    embeds: [confirmEmbed],
                    components: [],
                });
            }
        }
    }
}

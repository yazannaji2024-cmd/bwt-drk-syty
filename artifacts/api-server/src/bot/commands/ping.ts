import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("بنج")
  .setDescription("فحص استجابة البوت");

export async function execute(interaction: ChatInputCommandInteraction) {
  const ping = interaction.client.ws.ping;
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("🏓 بنج!")
    .addFields({ name: "⏱️ التأخير", value: `${ping}ms` })
    .setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

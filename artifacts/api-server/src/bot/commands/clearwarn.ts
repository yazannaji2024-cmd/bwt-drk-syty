import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { warningsStore } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("مسح_انذارات")
  .setDescription("مسح جميع إنذارات عضو")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد مسح إنذاراته").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getMember("العضو") as any;
  if (!target) return interaction.reply({ content: "❌ لم يتم العثور على العضو.", ephemeral: true });
  const key = `${interaction.guildId}:${target.id}`;
  warningsStore.delete(key);
  const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("🗑️ تم مسح الإنذارات")
    .addFields({ name: "العضو", value: `${target.user.tag}`, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

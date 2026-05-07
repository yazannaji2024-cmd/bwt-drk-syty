import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { warningsStore } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("انذار")
  .setDescription("إنذار عضو في السيرفر")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد إنذاره").setRequired(true))
  .addStringOption((o) => o.setName("السبب").setDescription("سبب الإنذار").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getMember("العضو") as any;
  const reason = interaction.options.getString("السبب", true);
  if (!target) return interaction.reply({ content: "❌ لم يتم العثور على العضو.", ephemeral: true });
  const key = `${interaction.guildId}:${target.id}`;
  const userWarnings = warningsStore.get(key) ?? [];
  userWarnings.push({ reason, by: interaction.user.tag, at: new Date() });
  warningsStore.set(key, userWarnings);
  try {
    const dmEmbed = new EmbedBuilder().setColor(0xffff00).setAuthor({ name: "تحذير من دارك سيتي" }).setTitle("⚠️ تحذير رسمي")
      .addFields({ name: "📋 السبب", value: reason }, { name: "👮 بواسطة", value: interaction.user.tag, inline: true }, { name: "🔢 عدد تحذيراتك", value: `${userWarnings.length}`, inline: true }, { name: "📌 ملاحظة", value: "يُرجى الالتزام بقوانين السيرفر." }).setTimestamp();
    await (target as any).send({ embeds: [dmEmbed] });
  } catch { }
  const embed = new EmbedBuilder().setColor(0xffff00).setTitle("⚠️ تم الإنذار")
    .addFields({ name: "العضو", value: `${target.user.tag}`, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "عدد الإنذارات", value: `${userWarnings.length}`, inline: true }, { name: "السبب", value: reason }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

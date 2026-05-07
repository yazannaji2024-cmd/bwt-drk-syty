import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { warningsStore } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("الانذارات")
  .setDescription("عرض إنذارات عضو")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد عرض إنذاراته").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getMember("العضو") as any;
  if (!target) return interaction.reply({ content: "❌ لم يتم العثور على العضو.", ephemeral: true });
  const key = `${interaction.guildId}:${target.id}`;
  const userWarnings = warningsStore.get(key) ?? [];
  if (userWarnings.length === 0) return interaction.reply({ content: `✅ لا توجد إنذارات على **${target.user.tag}**.`, ephemeral: true });
  const embed = new EmbedBuilder().setColor(0xffff00).setTitle(`⚠️ إنذارات ${target.user.tag}`)
    .setDescription(`إجمالي الإنذارات: **${userWarnings.length}**`)
    .addFields(userWarnings.slice(0, 10).map((w, i) => ({ name: `${i + 1}. ${w.reason}`, value: `بواسطة: ${w.by} | <t:${Math.floor(w.at.getTime() / 1000)}:R>` }))).setTimestamp();
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

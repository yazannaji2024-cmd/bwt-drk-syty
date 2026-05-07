import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("حظر")
  .setDescription("حظر عضو من السيرفر")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد حظره").setRequired(true))
  .addStringOption((o) => o.setName("السبب").setDescription("سبب الحظر").setRequired(false))
  .addIntegerOption((o) => o.setName("حذف_الرسائل").setDescription("حذف رسائل العضو (بالأيام)").setMinValue(0).setMaxValue(7).setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getMember("العضو") as any;
  const reason = interaction.options.getString("السبب") ?? "لم يُحدد سبب";
  const deleteMessageSeconds = (interaction.options.getInteger("حذف_الرسائل") ?? 0) * 86400;
  if (!target) return interaction.reply({ content: "❌ لم يتم العثور على العضو.", ephemeral: true });
  if (!target.bannable) return interaction.reply({ content: "❌ لا يمكنني حظر هذا العضو (رتبته أعلى مني).", ephemeral: true });
  await target.ban({ reason, deleteMessageSeconds });
  const embed = new EmbedBuilder().setColor(0xff0000).setTitle("🔨 تم الحظر")
    .addFields({ name: "العضو", value: `${target.user.tag}`, inline: true }, { name: "بواسطة", value: `${interaction.user.tag}`, inline: true }, { name: "السبب", value: reason }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

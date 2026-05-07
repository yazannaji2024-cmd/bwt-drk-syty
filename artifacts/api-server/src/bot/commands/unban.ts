import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("رفع_حظر")
  .setDescription("رفع الحظر عن مستخدم")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addStringOption((o) => o.setName("المعرف").setDescription("معرف المستخدم (ID)").setRequired(true))
  .addStringOption((o) => o.setName("السبب").setDescription("سبب رفع الحظر").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const userId = interaction.options.getString("المعرف", true);
  const reason = interaction.options.getString("السبب") ?? "لم يُحدد سبب";
  try {
    await interaction.guild!.members.unban(userId, reason);
    const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("✅ تم رفع الحظر")
      .addFields({ name: "المعرف", value: userId, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "السبب", value: reason }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  } catch {
    await interaction.reply({ content: "❌ لم يتم العثور على المستخدم في قائمة الحظر.", ephemeral: true });
  }
}

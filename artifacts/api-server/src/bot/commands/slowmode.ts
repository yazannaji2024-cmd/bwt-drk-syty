import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("تباطو")
  .setDescription("تفعيل أو إيقاف وضع التباطؤ في القناة")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .addIntegerOption((o) => o.setName("الثواني").setDescription("عدد الثواني (0 لإيقاف التباطؤ)").setMinValue(0).setMaxValue(21600).setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const seconds = interaction.options.getInteger("الثواني", true);
  const channel = interaction.channel as TextChannel;
  await channel.setRateLimitPerUser(seconds);
  const embed = new EmbedBuilder().setColor(seconds > 0 ? 0xffaa00 : 0x00ff00)
    .setTitle(seconds > 0 ? "🐌 تم تفعيل وضع التباطؤ" : "✅ تم إيقاف وضع التباطؤ")
    .setDescription(seconds > 0 ? `كل مستخدم يستطيع إرسال رسالة كل **${seconds}** ثانية` : "يمكن للأعضاء إرسال الرسائل بشكل طبيعي")
    .addFields({ name: "بواسطة", value: interaction.user.tag }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

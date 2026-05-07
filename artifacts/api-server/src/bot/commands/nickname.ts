import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("تغيير_اسم")
  .setDescription("تغيير لقب عضو في السيرفر")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المستهدف").setRequired(true))
  .addStringOption((o) => o.setName("اللقب").setDescription("اللقب الجديد (اتركه فارغاً لإزالة اللقب)").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser("العضو", true);
  const nickname = interaction.options.getString("اللقب") ?? null;
  await interaction.deferReply();
  const target = await interaction.guild!.members.fetch(targetUser.id).catch(() => null);
  if (!target) return interaction.editReply("❌ لم يتم العثور على العضو.");
  if (!target.manageable) return interaction.editReply("❌ لا يمكنني تغيير اسم هذا العضو.");
  await target.setNickname(nickname);
  const embed = new EmbedBuilder().setColor(0x5865f2).setTitle("✏️ تم تغيير اللقب")
    .addFields({ name: "العضو", value: target.user.tag, inline: true }, { name: "اللقب الجديد", value: nickname ?? "تم الإزالة", inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }).setTimestamp();
  await interaction.editReply({ embeds: [embed] });
}

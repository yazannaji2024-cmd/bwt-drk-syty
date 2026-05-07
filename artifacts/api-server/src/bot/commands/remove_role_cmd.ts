import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ازالة_رتبة")
  .setDescription("إزالة رتبة أو أكثر من عضو (حتى 5 رتب)")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المستهدف").setRequired(true))
  .addRoleOption((o) => o.setName("رتبة_١").setDescription("الرتبة الأولى").setRequired(true))
  .addRoleOption((o) => o.setName("رتبة_٢").setDescription("الرتبة الثانية").setRequired(false))
  .addRoleOption((o) => o.setName("رتبة_٣").setDescription("الرتبة الثالثة").setRequired(false))
  .addRoleOption((o) => o.setName("رتبة_٤").setDescription("الرتبة الرابعة").setRequired(false))
  .addRoleOption((o) => o.setName("رتبة_٥").setDescription("الرتبة الخامسة").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser("العضو", true);
  await interaction.deferReply();
  const guild = interaction.guild!;
  const target = await guild.members.fetch(targetUser.id).catch(() => null);
  if (!target) return interaction.editReply("❌ لم يتم العثور على العضو.");
  const roles = (["رتبة_١","رتبة_٢","رتبة_٣","رتبة_٤","رتبة_٥"] as const)
    .map((k) => interaction.options.getRole(k)).filter((r) => r !== null);
  if (roles.length === 0) return interaction.editReply("❌ لا توجد رتب محددة.");
  await target.roles.remove(roles.map((r) => r!.id));
  const embed = new EmbedBuilder().setColor(0xff6600).setTitle("✅ تمت إزالة الرتب")
    .addFields({ name: "العضو", value: target.user.tag, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "الرتب المزالة", value: roles.map((r) => `${r}`).join(", ") }).setTimestamp();
  await interaction.editReply({ embeds: [embed] });
}

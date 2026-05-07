import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("رتبة")
  .setDescription("إضافة أو إزالة رتبة من عضو")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addStringOption((o) => o.setName("الإجراء").setDescription("إضافة أو إزالة").setRequired(true).addChoices({ name: "إضافة", value: "add" }, { name: "إزالة", value: "remove" }))
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المستهدف").setRequired(true))
  .addRoleOption((o) => o.setName("الرتبة").setDescription("الرتبة المراد إضافتها أو إزالتها").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const action = interaction.options.getString("الإجراء", true);
  const targetUser = interaction.options.getUser("العضو", true);
  const role = interaction.options.getRole("الرتبة", true);
  await interaction.deferReply();
  const target = await interaction.guild!.members.fetch(targetUser.id).catch(() => null);
  if (!target) return interaction.editReply("❌ لم يتم العثور على العضو.");
  if (action === "add") await target.roles.add(role.id);
  else await target.roles.remove(role.id);
  const embed = new EmbedBuilder().setColor(action === "add" ? 0x00ff00 : 0xff6600)
    .setTitle(action === "add" ? "✅ تمت إضافة الرتبة" : "✅ تمت إزالة الرتبة")
    .addFields({ name: "العضو", value: target.user.tag, inline: true }, { name: "الرتبة", value: `${role}`, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }).setTimestamp();
  await interaction.editReply({ embeds: [embed] });
}

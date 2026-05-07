import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("مسح")
  .setDescription("حذف عدد محدد من الرسائل")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((o) => o.setName("العدد").setDescription("عدد الرسائل المراد حذفها (1-100)").setMinValue(1).setMaxValue(100).setRequired(true))
  .addUserOption((o) => o.setName("العضو").setDescription("حذف رسائل عضو معين فقط").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const amount = interaction.options.getInteger("العدد", true);
  const targetUser = interaction.options.getUser("العضو");
  const channel = interaction.channel as TextChannel;
  await interaction.deferReply({ ephemeral: true });
  let messages = await channel.messages.fetch({ limit: 100 });
  if (targetUser) messages = messages.filter((m) => m.author.id === targetUser.id);
  const toDelete = [...messages.values()].slice(0, amount);
  const deleted = await channel.bulkDelete(toDelete, true);
  const embed = new EmbedBuilder().setColor(0x3498db).setTitle("🗑️ تم الحذف")
    .setDescription(`تم حذف **${deleted.size}** رسالة${targetUser ? ` من **${targetUser.tag}**` : ""}`).setTimestamp();
  await interaction.editReply({ embeds: [embed] });
}

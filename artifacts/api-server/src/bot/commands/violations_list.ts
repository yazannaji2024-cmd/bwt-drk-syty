import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { violationsStore } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("مخالفات")
  .setDescription("عرض مخالفات عضو")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد عرض مخالفاته").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser("العضو", true);
  const guildId = interaction.guildId!;
  const allViolations = violationsStore.get(guildId) ?? [];
  const userViolations = allViolations.filter((v) => v.violatorId === targetUser.id && !v.paid);
  if (userViolations.length === 0) return interaction.reply({ content: `✅ لا توجد مخالفات مستحقة على **${targetUser.tag}**.`, ephemeral: true });
  const totalPrice = userViolations.reduce((sum, v) => sum + v.price, 0);
  const embed = new EmbedBuilder().setColor(0xff6600).setTitle(`📋 مخالفات ${targetUser.tag}`)
    .setDescription(`إجمالي المخالفات: **${userViolations.length}** | إجمالي المبلغ: **${totalPrice.toLocaleString("ar-SA")} ريال**`)
    .addFields(userViolations.slice(0, 10).map((v) => ({ name: `مخالفة #${v.id}`, value: [`👮 العسكري: ${v.officerName}`, `📋 السبب: ${v.reason}`, `💰 السعر: ${v.price.toLocaleString("ar-SA")} ريال`, `📅 التاريخ: <t:${Math.floor(v.timestamp.getTime() / 1000)}:R>`].join("\n") }))).setTimestamp();
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { violationsStore } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("سداد")
  .setDescription("تسجيل سداد مخالفة مرورية وإزالتها")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addIntegerOption((o) => o.setName("رقم_المخالفة").setDescription("رقم المخالفة المراد إغلاقها").setRequired(true).setMinValue(1))
  .addStringOption((o) => o.setName("ملاحظة").setDescription("ملاحظة عند السداد").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const violationId = interaction.options.getInteger("رقم_المخالفة", true);
  const note = interaction.options.getString("ملاحظة") ?? "تم السداد";
  const guildId = interaction.guildId!;
  const violations = violationsStore.get(guildId) ?? [];
  const violation = violations.find((v) => v.id === violationId && !v.paid);
  if (!violation) return interaction.reply({ content: `❌ لم يتم العثور على مخالفة رقم **#${violationId}** أو قد تم سدادها مسبقاً.`, ephemeral: true });
  violation.paid = true;
  const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("✅ تم تسجيل السداد")
    .addFields({ name: "رقم المخالفة", value: `#${violationId}`, inline: true }, { name: "المتخالف", value: `<@${violation.violatorId}>`, inline: true }, { name: "المبلغ المسدد", value: `${violation.price.toLocaleString("ar-SA")} ريال`, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "ملاحظة", value: note }).setTimestamp();
  try {
    const violatorUser = await interaction.client.users.fetch(violation.violatorId);
    const payDmEmbed = new EmbedBuilder().setColor(0x00ff00).setAuthor({ name: "دارك سيتي" }).setTitle("✅ تم تسجيل السداد")
      .addFields({ name: "🔢 رقم المخالفة", value: `#${violationId}`, inline: true }, { name: "💰 المبلغ المسدد", value: `${violation.price.toLocaleString("ar-SA")} ريال`, inline: true }, { name: "📌 ملاحظة", value: note }).setTimestamp();
    await violatorUser.send({ embeds: [payDmEmbed] });
  } catch { }
  await interaction.reply({ embeds: [embed] });
}

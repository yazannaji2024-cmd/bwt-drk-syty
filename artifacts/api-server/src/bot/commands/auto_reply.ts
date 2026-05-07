import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { autoRepliesStore } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("ردود_تلقائية")
  .setDescription("إدارة الردود التلقائية للبوت")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addSubcommand((s) => s.setName("اضافة").setDescription("إضافة رد تلقائي جديد")
    .addStringOption((o) => o.setName("المحفز").setDescription("الكلمة أو الجملة التي تُشغّل الرد").setRequired(true))
    .addStringOption((o) => o.setName("الرد").setDescription("الرد التلقائي الذي يرسله البوت").setRequired(true)))
  .addSubcommand((s) => s.setName("حذف").setDescription("حذف رد تلقائي")
    .addStringOption((o) => o.setName("المحفز").setDescription("الكلمة التي تريد حذف ردها").setRequired(true)))
  .addSubcommand((s) => s.setName("قائمة").setDescription("عرض جميع الردود التلقائية"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  const guildId = interaction.guildId!;
  if (sub === "اضافة") {
    const trigger = interaction.options.getString("المحفز", true);
    const response = interaction.options.getString("الرد", true);
    const rules = autoRepliesStore.get(guildId) ?? [];
    const existing = rules.find((r) => r.trigger.toLowerCase() === trigger.toLowerCase());
    if (existing) existing.response = response; else rules.push({ trigger, response });
    autoRepliesStore.set(guildId, rules);
    return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x00ff00).setTitle("✅ تمت إضافة الرد التلقائي").addFields({ name: "📩 المحفز", value: `\`${trigger}\``, inline: true }, { name: "💬 الرد", value: response, inline: true }).setTimestamp()] });
  }
  if (sub === "حذف") {
    const trigger = interaction.options.getString("المحفز", true);
    const rules = autoRepliesStore.get(guildId) ?? [];
    const index = rules.findIndex((r) => r.trigger.toLowerCase() === trigger.toLowerCase());
    if (index === -1) return interaction.reply({ content: `❌ لم يتم العثور على رد تلقائي للمحفز: \`${trigger}\``, ephemeral: true });
    rules.splice(index, 1); autoRepliesStore.set(guildId, rules);
    return interaction.reply({ content: `✅ تم حذف الرد التلقائي للمحفز: \`${trigger}\`` });
  }
  if (sub === "قائمة") {
    const rules = autoRepliesStore.get(guildId) ?? [];
    if (rules.length === 0) return interaction.reply({ content: "📭 لا توجد ردود تلقائية مضافة.", ephemeral: true });
    const embed = new EmbedBuilder().setColor(0x5865f2).setTitle("📋 الردود التلقائية").setDescription(`إجمالي الردود: **${rules.length}**`)
      .addFields(rules.slice(0, 25).map((r, i) => ({ name: `${i + 1}. ${r.trigger}`, value: r.response.length > 100 ? r.response.slice(0, 100) + "..." : r.response }))).setTimestamp();
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

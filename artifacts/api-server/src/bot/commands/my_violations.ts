import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { violationsStore } from "../data/store";

export const data = new SlashCommandBuilder().setName("مخالفاتي").setDescription("عرض مخالفاتك المرورية في خاص البوت");

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const allViolations = violationsStore.get(guildId) ?? [];
  const myViolations = allViolations.filter((v) => v.violatorId === interaction.user.id && !v.paid);
  await interaction.deferReply({ ephemeral: true });
  if (myViolations.length === 0) {
    try { await interaction.user.send({ embeds: [new EmbedBuilder().setColor(0x00ff00).setAuthor({ name: "دارك سيتي" }).setTitle("✅ لا توجد مخالفات").setDescription("ليس عليك أي مخالفات مستحقة.").setTimestamp()] }); } catch { }
    return interaction.editReply("✅ ليس عليك أي مخالفات مستحقة.");
  }
  const totalPrice = myViolations.reduce((sum, v) => sum + v.price, 0);
  const embed = new EmbedBuilder().setColor(0xff6600).setAuthor({ name: "دارك سيتي" }).setTitle("📋 مخالفاتك المرورية")
    .setDescription(`إجمالي مخالفاتك: **${myViolations.length}** | إجمالي المبلغ المستحق: **${totalPrice.toLocaleString("ar-SA")} ريال**`)
    .addFields(myViolations.slice(0, 10).map((v) => ({ name: `مخالفة #${v.id}`, value: [`👮 العسكري: ${v.officerName}`, `📋 السبب: ${v.reason}`, `💰 السعر: ${v.price.toLocaleString("ar-SA")} ريال`, `📅 التاريخ: <t:${Math.floor(v.timestamp.getTime() / 1000)}:R>`].join("\n") })))
    .setFooter({ text: "تواصل مع وزارة الداخلية لسداد المخالفات." }).setTimestamp();
  try { await interaction.user.send({ embeds: [embed] }); await interaction.editReply("✅ تم إرسال مخالفاتك في الخاص."); }
  catch { await interaction.editReply({ embeds: [embed] }); }
}

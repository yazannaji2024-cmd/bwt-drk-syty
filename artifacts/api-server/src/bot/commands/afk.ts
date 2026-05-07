import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { afkStore } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("afk")
  .setDescription("تفعيل وضع الغياب (AFK) — سيُبلَّغ من ذكرك أنك غائب")
  .addStringOption((o) => o.setName("السبب").setDescription("سبب الغياب").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const reason = interaction.options.getString("السبب") ?? "غائب";
  const userId = interaction.user.id;
  const guildId = interaction.guildId!;
  afkStore.set(`${guildId}:${userId}`, { reason, since: Date.now(), username: interaction.user.username });
  const embed = new EmbedBuilder().setColor(0x747f8d).setAuthor({ name: "دارك سيتي" }).setTitle("💤 وضع الغياب مُفعَّل")
    .setDescription(`تم تفعيل وضع الغياب لـ <@${userId}>`).addFields({ name: "📋 السبب", value: reason })
    .setFooter({ text: "سيتم إلغاء وضع الغياب تلقائياً عند إرسالك رسالة" }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

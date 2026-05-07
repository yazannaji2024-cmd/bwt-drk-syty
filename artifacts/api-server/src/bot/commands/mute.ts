import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

const durations: Record<string, number> = { "60": 60, "300": 300, "600": 600, "1800": 1800, "3600": 3600, "21600": 21600, "86400": 86400, "604800": 604800 };
const durationLabels: Record<string, string> = { "60": "دقيقة واحدة", "300": "5 دقائق", "600": "10 دقائق", "1800": "30 دقيقة", "3600": "ساعة واحدة", "21600": "6 ساعات", "86400": "يوم واحد", "604800": "أسبوع واحد" };

export const data = new SlashCommandBuilder()
  .setName("كتم")
  .setDescription("كتم عضو مؤقتاً (Timeout)")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد كتمه").setRequired(true))
  .addStringOption((o) => o.setName("المدة").setDescription("مدة الكتم").setRequired(true)
    .addChoices(
      { name: "دقيقة واحدة", value: "60" }, { name: "5 دقائق", value: "300" },
      { name: "10 دقائق", value: "600" }, { name: "30 دقيقة", value: "1800" },
      { name: "ساعة واحدة", value: "3600" }, { name: "6 ساعات", value: "21600" },
      { name: "يوم واحد", value: "86400" }, { name: "أسبوع واحد", value: "604800" }
    ))
  .addStringOption((o) => o.setName("السبب").setDescription("سبب الكتم").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getMember("العضو") as any;
  const durationStr = interaction.options.getString("المدة", true);
  const reason = interaction.options.getString("السبب") ?? "لم يُحدد سبب";
  const seconds = durations[durationStr] ?? 60;
  if (!target) return interaction.reply({ content: "❌ لم يتم العثور على العضو.", ephemeral: true });
  if (!target.moderatable) return interaction.reply({ content: "❌ لا يمكنني كتم هذا العضو.", ephemeral: true });
  await target.timeout(seconds * 1000, reason);
  const embed = new EmbedBuilder().setColor(0xffaa00).setTitle("🔇 تم الكتم")
    .addFields({ name: "العضو", value: `${target.user.tag}`, inline: true }, { name: "المدة", value: durationLabels[durationStr] ?? durationStr, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "السبب", value: reason }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("رفع_كتم")
  .setDescription("رفع الكتم عن عضو")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد رفع كتمه").setRequired(true))
  .addStringOption((o) => o.setName("السبب").setDescription("سبب رفع الكتم").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getMember("العضو") as any;
  const reason = interaction.options.getString("السبب") ?? "لم يُحدد سبب";
  if (!target) return interaction.reply({ content: "❌ لم يتم العثور على العضو.", ephemeral: true });
  await target.timeout(null, reason);
  const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("🔊 تم رفع الكتم")
    .addFields({ name: "العضو", value: `${target.user.tag}`, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "السبب", value: reason }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

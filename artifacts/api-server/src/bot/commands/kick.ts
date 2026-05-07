import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("طرد")
  .setDescription("طرد عضو من السيرفر")
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد طرده").setRequired(true))
  .addStringOption((o) => o.setName("السبب").setDescription("سبب الطرد").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getMember("العضو") as any;
  const reason = interaction.options.getString("السبب") ?? "لم يُحدد سبب";
  if (!target) return interaction.reply({ content: "❌ لم يتم العثور على العضو.", ephemeral: true });
  if (!target.kickable) return interaction.reply({ content: "❌ لا يمكنني طرد هذا العضو.", ephemeral: true });
  await target.kick(reason);
  const embed = new EmbedBuilder().setColor(0xff6600).setTitle("👢 تم الطرد")
    .addFields({ name: "العضو", value: `${target.user.tag}`, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "السبب", value: reason }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("فتح")
  .setDescription("فتح قناة والسماح للأعضاء بالكتابة فيها")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .addStringOption((o) => o.setName("السبب").setDescription("سبب الفتح").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const reason = interaction.options.getString("السبب") ?? "لم يُحدد سبب";
  const channel = interaction.channel as TextChannel;
  const everyoneRole = interaction.guild?.roles.everyone;
  if (!everyoneRole) return;
  await channel.permissionOverwrites.edit(everyoneRole, { SendMessages: null });
  const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("🔓 تم فتح القناة")
    .setDescription(`تم فتح ${channel}`).addFields({ name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "السبب", value: reason }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

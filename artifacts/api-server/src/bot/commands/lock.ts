import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("قفل")
  .setDescription("قفل قناة ومنع الأعضاء من الكتابة فيها")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .addStringOption((o) => o.setName("السبب").setDescription("سبب القفل").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const reason = interaction.options.getString("السبب") ?? "لم يُحدد سبب";
  const channel = interaction.channel as TextChannel;
  const everyoneRole = interaction.guild?.roles.everyone;
  if (!everyoneRole) return;
  await channel.permissionOverwrites.edit(everyoneRole, { SendMessages: false });
  const embed = new EmbedBuilder().setColor(0xff0000).setTitle("🔒 تم قفل القناة")
    .setDescription(`تم قفل ${channel}`).addFields({ name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "السبب", value: reason }).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

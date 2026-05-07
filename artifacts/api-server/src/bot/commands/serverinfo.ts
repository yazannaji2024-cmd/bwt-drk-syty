import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder().setName("معلومات_سيرفر").setDescription("عرض معلومات السيرفر");

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild!;
  await guild.fetch();
  const embed = new EmbedBuilder().setColor(0x5865f2).setTitle(`📊 معلومات سيرفر: ${guild.name}`)
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "🆔 المعرف", value: guild.id, inline: true },
      { name: "👑 المالك", value: `<@${guild.ownerId}>`, inline: true },
      { name: "👥 الأعضاء", value: `${guild.memberCount}`, inline: true },
      { name: "💬 القنوات", value: `${guild.channels.cache.size}`, inline: true },
      { name: "🎭 الرتب", value: `${guild.roles.cache.size}`, inline: true },
      { name: "📅 تاريخ الإنشاء", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>` }
    ).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

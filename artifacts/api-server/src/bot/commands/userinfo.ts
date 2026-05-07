import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder().setName("معلومات_عضو").setDescription("عرض معلومات عضو")
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد عرض معلوماته").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser("العضو") ?? interaction.user;
  const member = await interaction.guild!.members.fetch(targetUser.id).catch(() => null);
  const embed = new EmbedBuilder().setColor(0x5865f2).setTitle(`👤 معلومات العضو: ${targetUser.tag}`)
    .setThumbnail(targetUser.displayAvatarURL())
    .addFields(
      { name: "🆔 المعرف", value: targetUser.id, inline: true },
      { name: "📅 تاريخ إنشاء الحساب", value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>` },
      ...(member ? [{ name: "📅 تاريخ الانضمام", value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:F>` }, { name: "🎭 الرتب", value: member.roles.cache.filter(r => r.id !== interaction.guildId).map(r => `${r}`).join(", ") || "لا توجد رتب" }] : [])
    ).setTimestamp();
  await interaction.reply({ embeds: [embed] });
}

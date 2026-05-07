import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { prisonStore, PRISON_ROLE_ID } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("استرجاع_رتب")
  .setDescription("استرجاع رتب العضو بعد السجن")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد استرجاع رتبه").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser("العضو", true);
  await interaction.deferReply();
  const guild = interaction.guild!;
  const target = await guild.members.fetch(targetUser.id).catch(() => null);
  if (!target) return interaction.editReply("❌ لم يتم العثور على العضو.");
  const key = `${guild.id}:${target.id}`;
  const savedRoles = prisonStore.get(key);
  if (!savedRoles) return interaction.editReply("❌ لا توجد رتب محفوظة لهذا العضو.");
  const validRoles = savedRoles.filter((id) => guild.roles.cache.has(id));
  await target.roles.remove(PRISON_ROLE_ID).catch(() => {});
  if (validRoles.length > 0) await target.roles.add(validRoles);
  prisonStore.delete(key);
  const embed = new EmbedBuilder().setColor(0x00ff00).setTitle("✅ تم استرجاع الرتب")
    .addFields({ name: "العضو", value: target.user.tag, inline: true }, { name: "الرتب المسترجعة", value: `${validRoles.length} رتبة`, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }).setTimestamp();
  await interaction.editReply({ embeds: [embed] });
}

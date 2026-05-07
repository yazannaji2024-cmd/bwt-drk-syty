import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { prisonStore, PRISON_ROLE_ID } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("سجن")
  .setDescription("سجن عضو وإزالة كل رتبه وإعطاؤه رتبة السجن")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addUserOption((o) => o.setName("العضو").setDescription("العضو المراد سجنه").setRequired(true))
  .addStringOption((o) => o.setName("السبب").setDescription("سبب السجن").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser("العضو", true);
  const reason = interaction.options.getString("السبب") ?? "لم يُحدد سبب";
  await interaction.deferReply();
  const guild = interaction.guild!;
  const target = await guild.members.fetch(targetUser.id).catch(() => null);
  if (!target) return interaction.editReply("❌ لم يتم العثور على العضو.");
  if (!target.manageable) return interaction.editReply("❌ لا يمكنني إدارة هذا العضو.");
  const prisonRole = guild.roles.cache.get(PRISON_ROLE_ID);
  if (!prisonRole) return interaction.editReply("❌ لم يتم العثور على رتبة السجن.");
  const currentRoles = target.roles.cache.filter((r) => r.id !== guild.id && r.id !== PRISON_ROLE_ID).map((r) => r.id);
  prisonStore.set(`${guild.id}:${target.id}`, currentRoles);
  await target.roles.set([PRISON_ROLE_ID]);
  const embed = new EmbedBuilder().setColor(0x2c2f33).setTitle("🔒 تم السجن")
    .addFields({ name: "العضو", value: target.user.tag, inline: true }, { name: "بواسطة", value: interaction.user.tag, inline: true }, { name: "الرتب المحفوظة", value: `${currentRoles.length} رتبة`, inline: true }, { name: "السبب", value: reason }).setTimestamp();
  await interaction.editReply({ embeds: [embed] });
}

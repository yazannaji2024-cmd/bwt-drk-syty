import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("اعلان")
  .setDescription("إرسال إعلان في قناة محددة")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption((o) => o.setName("العنوان").setDescription("عنوان الإعلان").setRequired(true))
  .addStringOption((o) => o.setName("الرسالة").setDescription("نص الإعلان").setRequired(true))
  .addChannelOption((o) => o.setName("القناة").setDescription("القناة المراد الإعلان فيها").setRequired(false))
  .addStringOption((o) => o.setName("اللون").setDescription("لون الإعلان (hex مثال: #FF0000)").setRequired(false))
  .addBooleanOption((o) => o.setName("منشن_everyone").setDescription("منشن @everyone مع الإعلان").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const title = interaction.options.getString("العنوان", true);
  const message = interaction.options.getString("الرسالة", true);
  const channel = (interaction.options.getChannel("القناة") ?? interaction.channel) as TextChannel;
  const colorHex = interaction.options.getString("اللون") ?? "#5865F2";
  const mentionEveryone = interaction.options.getBoolean("منشن_everyone") ?? false;
  let color = 0x5865f2;
  try { color = parseInt(colorHex.replace("#", ""), 16); } catch { }
  const embed = new EmbedBuilder().setColor(color).setTitle(`📢 ${title}`)
    .setDescription(message).addFields({ name: "بواسطة", value: interaction.user.tag }).setTimestamp();
  await channel.send({ content: mentionEveryone ? "@everyone" : undefined, embeds: [embed] });
  await interaction.reply({ content: `✅ تم إرسال الإعلان في ${channel}`, ephemeral: true });
}

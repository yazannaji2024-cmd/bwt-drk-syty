import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { violationsStore, violationCounters } from "../data/store";

export const data = new SlashCommandBuilder()
  .setName("مخالفة")
  .setDescription("إصدار مخالفة مرورية لعضو")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("المتخالف").setDescription("العضو المتخالف").setRequired(true))
  .addStringOption((o) => o.setName("اسم_العسكري").setDescription("اسم العسكري المصدر للمخالفة").setRequired(true))
  .addStringOption((o) => o.setName("السبب").setDescription("سبب المخالفة").setRequired(true))
  .addNumberOption((o) => o.setName("السعر").setDescription("سعر المخالفة بالريال").setRequired(true).setMinValue(1))
  .addAttachmentOption((o) => o.setName("صورة_١").setDescription("صورة المخالفة الأولى").setRequired(false))
  .addAttachmentOption((o) => o.setName("صورة_٢").setDescription("صورة المخالفة الثانية").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  const violatorUser = interaction.options.getUser("المتخالف", true);
  const officerName = interaction.options.getString("اسم_العسكري", true);
  const reason = interaction.options.getString("السبب", true);
  const price = interaction.options.getNumber("السعر", true);
  const img1 = interaction.options.getAttachment("صورة_١");
  const img2 = interaction.options.getAttachment("صورة_٢");
  await interaction.deferReply();
  const guildId = interaction.guildId!;
  const counter = (violationCounters.get(guildId) ?? 0) + 1;
  violationCounters.set(guildId, counter);
  const images = [img1?.url, img2?.url].filter((u): u is string => !!u);
  const violations = violationsStore.get(guildId) ?? [];
  violations.push({ id: counter, officerName, violatorId: violatorUser.id, reason, price, images, paid: false, timestamp: new Date() });
  violationsStore.set(guildId, violations);
  const embed = new EmbedBuilder().setColor(0xff0000).setAuthor({ name: "دارك سيتي" }).setTitle(`🚨 مخالفة مرورية #${counter}`)
    .addFields({ name: "👮 اسم العسكري", value: officerName, inline: true }, { name: "🪪 المتخالف", value: `<@${violatorUser.id}>`, inline: true }, { name: "🔢 رقم المخالفة", value: `#${counter}`, inline: true }, { name: "📋 السبب", value: reason }, { name: "💰 السعر", value: `${price.toLocaleString("ar-SA")} ريال` }).setTimestamp();
  if (images[0]) embed.setImage(images[0]);
  const dmEmbed = new EmbedBuilder().setColor(0xff0000).setAuthor({ name: "دارك سيتي" }).setTitle("🚨 لديك مخالفة مرورية")
    .addFields({ name: "👮 اسم العسكري", value: officerName, inline: true }, { name: "🔢 رقم المخالفة", value: `#${counter}`, inline: true }, { name: "📋 السبب", value: reason }, { name: "💰 المبلغ المطلوب", value: `${price.toLocaleString("ar-SA")} ريال` }, { name: "📌 ملاحظة", value: "تواصل مع وزارة الداخلية لسداد المخالفة." }).setTimestamp();
  if (images[0]) dmEmbed.setImage(images[0]);
  try { await violatorUser.send({ embeds: [dmEmbed] }); } catch { }
  await interaction.editReply({ embeds: [embed] });
}

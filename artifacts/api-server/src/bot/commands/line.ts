import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

const LINE_GIF = "https://cdn.discordapp.com/attachments/1460524281979998412/1463510400250286227/1230935399728418929.gif?ex=69cf0986&is=69cdb806&hm=d6db9aab4adb08be74dc45d9b88c9ae9b896297d4d93d9b34e784a4cd70a4051&";

export const data = new SlashCommandBuilder().setName("خط").setDescription("إرسال خط فاصل");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({ content: LINE_GIF });
}

import { Client, GatewayIntentBits, Collection, Events, Partials, type ChatInputCommandInteraction } from "discord.js";
import { logger } from "../lib/logger";
import { autoRepliesStore, afkStore, ADMIN_ROLE_ID, CITIZEN_ROLE_ID } from "./data/store";

import * as ping from "./commands/ping";
import * as kick from "./commands/kick";
import * as ban from "./commands/ban";
import * as unban from "./commands/unban";
import * as mute from "./commands/mute";
import * as unmute from "./commands/unmute";
import * as warn from "./commands/warn";
import * as warnings from "./commands/warnings";
import * as clearwarn from "./commands/clearwarn";
import * as clear from "./commands/clear";
import * as slowmode from "./commands/slowmode";
import * as lock from "./commands/lock";
import * as unlock from "./commands/unlock";
import * as role from "./commands/role";
import * as nickname from "./commands/nickname";
import * as serverinfo from "./commands/serverinfo";
import * as userinfo from "./commands/userinfo";
import * as announce from "./commands/announce";
import * as help from "./commands/help";
import * as jail from "./commands/jail";
import * as restoreRoles from "./commands/restore_roles";
import * as giveRole from "./commands/give_role";
import * as removeRoleCmd from "./commands/remove_role_cmd";
import * as violation from "./commands/violation";
import * as violationsList from "./commands/violations_list";
import * as myViolations from "./commands/my_violations";
import * as pay from "./commands/pay";
import * as autoReply from "./commands/auto_reply";
import * as line from "./commands/line";
import * as afk from "./commands/afk";

type CommandModule = {
  data: { name: string; toJSON(): unknown };
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
};

const allCommands: CommandModule[] = [
  ping, kick, ban, unban, mute, unmute,
  warn, warnings, clearwarn, clear, slowmode,
  lock, unlock, role, nickname, serverinfo,
  userinfo, announce, help,
  jail, restoreRoles, giveRole, removeRoleCmd,
  violation, violationsList, myViolations, pay,
  autoReply, line, afk,
];

const PUBLIC_COMMANDS = new Set(["بنج", "اوامر", "خط", "مخالفاتي", "afk", "معلومات_عضو", "معلومات_سيرفر"]);
const CITIZEN_COMMANDS = new Set(["مخالفاتي"]);

export let botClient: Client | null = null;

export function startBot() {
  const token = process.env["DISCORD_BOT_TOKEN"];
  if (!token) {
    logger.warn("DISCORD_BOT_TOKEN not set — Discord bot will not start.");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildMessages,
      ...(process.env["ENABLE_MESSAGE_CONTENT"] === "true"
        ? [GatewayIntentBits.MessageContent]
        : []),
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
  });

  const commands = new Collection<string, CommandModule>();
  for (const cmd of allCommands) {
    commands.set(cmd.data.name, cmd);
  }

  client.once(Events.ClientReady, (c) => {
    logger.info(`Discord bot ready! Logged in as ${c.user.tag}`);
    botClient = client;
  });

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.guildId) return;
    const guildId = message.guildId;
    const userId = message.author.id;
    const afkKey = `${guildId}:${userId}`;

    if (afkStore.has(afkKey)) {
      const afkData = afkStore.get(afkKey)!;
      afkStore.delete(afkKey);
      const elapsed = Math.floor((Date.now() - afkData.since) / 1000);
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const timeStr = hours > 0 ? `${hours} ساعة و${minutes} دقيقة` : `${minutes} دقيقة`;
      await message.reply(`✅ مرحباً بعودتك **${message.author.username}**! تم إلغاء وضع الغياب. كنت غائباً لمدة **${timeStr}**.`).catch(() => {});
    }

    for (const [mentionedId] of message.mentions.users) {
      const mentionedKey = `${guildId}:${mentionedId}`;
      if (afkStore.has(mentionedKey)) {
        const afkData = afkStore.get(mentionedKey)!;
        const elapsed = Math.floor((Date.now() - afkData.since) / 1000);
        const minutes = Math.floor(elapsed / 60);
        await message.reply(`💤 **${afkData.username}** في وضع الغياب منذ **${minutes} دقيقة**.\n📋 السبب: ${afkData.reason}`).catch(() => {});
      }
    }

    const rules = autoRepliesStore.get(guildId) ?? [];
    for (const rule of rules) {
      if (message.content.includes(rule.trigger)) {
        await message.reply(rule.response).catch(() => {});
        break;
      }
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const member = interaction.member as any;

    if (!PUBLIC_COMMANDS.has(commandName)) {
      if (!member?.roles?.cache?.has(ADMIN_ROLE_ID)) {
        const reply = { content: "❌ ليس لديك صلاحية استخدام هذا الأمر.\nهذا الأمر مخصص للإدارة فقط.", ephemeral: true };
        if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {});
        else await interaction.reply(reply).catch(() => {});
        return;
      }
    }

    if (CITIZEN_COMMANDS.has(commandName)) {
      if (!member?.roles?.cache?.has(CITIZEN_ROLE_ID)) {
        const reply = { content: "❌ هذا الأمر للمواطنين فقط.", ephemeral: true };
        if (interaction.replied || interaction.deferred) await interaction.followUp(reply).catch(() => {});
        else await interaction.reply(reply).catch(() => {});
        return;
      }
    }

    const command = commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      logger.error({ err }, `Error executing command: ${commandName}`);
      const msg = { content: "❌ حدث خطأ أثناء تنفيذ الأمر.", ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {});
      else await interaction.reply(msg).catch(() => {});
    }
  });

  client.login(token).catch((err) => {
    logger.error({ err }, "Failed to login to Discord");
  });
}

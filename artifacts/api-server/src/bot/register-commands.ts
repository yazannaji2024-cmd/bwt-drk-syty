import { REST, Routes } from "discord.js";
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

const token = process.env["DISCORD_BOT_TOKEN"];
const clientId = process.env["DISCORD_CLIENT_ID"];

if (!token || !clientId) {
  console.error("Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID");
  process.exit(1);
}

const commands = [
  ping, kick, ban, unban, mute, unmute,
  warn, warnings, clearwarn, clear, slowmode,
  lock, unlock, role, nickname, serverinfo,
  userinfo, announce, help,
  jail, restoreRoles, giveRole, removeRoleCmd,
  violation, violationsList, myViolations, pay,
  autoReply, line, afk,
].map((c) => c.data.toJSON());

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Registering ${commands.length} application commands...`);
    const data = await rest.put(Routes.applicationCommands(clientId), { body: commands }) as unknown[];
    console.log(`Successfully registered ${data.length} commands globally.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

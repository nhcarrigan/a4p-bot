import { TextChannel } from "discord.js";

import { ExtendedClient } from "../../interface/ExtendedClient";

/**
 * Sends a reminder to claim the unclaimed distribution requests.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const sendUnclaimedDistros = async (bot: ExtendedClient) => {
  try {
    const guild = await bot.guilds.fetch("1172566005311090798");
    const artChannel = (await guild.channels.fetch(
      "1173061747737903315"
    )) as TextChannel;
    const messages = await artChannel.messages.fetch({
      after: "1241055357112025168",
    });
    const filtered = messages.filter((m) => !m.hasThread);

    if (!filtered.size) {
      return;
    }

    const channel = await guild.channels.fetch("1173061809834565764");

    if (!channel || !("send" in channel)) {
      await bot.debug.send(`Failed to find <#1173061809834565764>~!`);
      return;
    }

    await channel.send(`## Unclaimed Distribtions!

The following art rewards have not been distributed yet. If you have the capacity to do so, please consider taking one on.

${filtered.map((r) => `- ${r.url}`).join("\n")}`);
  } catch (err) {
    await bot.debug.send(`Cannot send unclaimed distro reminder: ${err}`);
  }
};

import { TextChannel } from "discord.js";

import { ExtendedClient } from "../../interface/ExtendedClient";

/**
 * Sends a reminder to claim the unclaimed art rewards.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const sendUnclaimedArt = async (bot: ExtendedClient) => {
  try {
    const guild = await bot.guilds.fetch("1172566005311090798");
    const artChannel = (await guild.channels.fetch(
      "1172568787330019340"
    )) as TextChannel;
    const messages = await artChannel.messages.fetch({
      after: "1241326793294610443",
    });
    const filtered = messages.filter((m) => !m.hasThread);

    if (!filtered.size) {
      return;
    }

    const channel = await guild.channels.fetch("1172568865218252801");

    if (!channel || !("send" in channel)) {
      await bot.debug.send(`Failed to find <#1172568865218252801>~!`);
      return;
    }

    await channel.send(`## Unclaimed Art!

The following art rewards have not been claimed yet. If you have the capacity to do so, please consider taking one on.

${filtered.map((r) => `- ${r.url}`).join("\n")}`);
  } catch (err) {
    await bot.debug.send(`Cannot send unclaimed art reminder: ${err}`);
  }
};

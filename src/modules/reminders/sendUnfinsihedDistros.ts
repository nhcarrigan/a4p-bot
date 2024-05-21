import { TextChannel } from "discord.js";

import { ExtendedClient } from "../../interface/ExtendedClient";

/**
 * Sends a reminder to finish claimed distribution requests.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const sendUnfinishedDistros = async (bot: ExtendedClient) => {
  try {
    const guild = await bot.guilds.fetch("1172566005311090798");
    const channel = (await guild.channels.fetch(
      "1173061747737903315"
    )) as TextChannel;
    const threads = await channel.threads.fetchActive();
    for (const thread of threads.threads.values()) {
      await thread.send({
        content: `<@!${thread.name}>, this distribution appears unconfirmed. When it's complete, please upload a confirmation image here and the thread will be processed.`,
      });
    }
  } catch (err) {
    await bot.debug.send(`Cannot send unfinished art reminder: ${err}`);
  }
};

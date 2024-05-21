import { User } from "discord.js";

export enum Webhooks {
  NewCommissions = "1172850885571911760",
  CompleteCommissions = "1173062416041525259",
}

/**
 * Grabs the user from Discord, formats it based on the webhook ID.
 *
 * @param {User} u The user payload from Discord.
 * @returns {string} The formatted text to send.
 */
export const ClaimTexts: { [key in Webhooks]: (u: User) => string } = {
  [Webhooks.NewCommissions]: (u) =>
    `Thanks for agreeing to do this art, <@!${u.id}>~! When it's completed, upload the image here and I'll automatically close this thread!`,
  [Webhooks.CompleteCommissions]: (u) =>
    `Thanks for agreeing to deliver this art, <@!${u.id}>~! When it's completed, upload a confirmation image here and I'll automatically close this thread!`,
};

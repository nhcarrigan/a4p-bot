import { readFile, writeFile } from "fs/promises";
import { join } from "path";

import { AttachmentBuilder } from "discord.js";

import { AirtableResponse } from "../interface/AirtableResponse";
import { ExtendedClient } from "../interface/ExtendedClient";

/**
 * Fetches the Airtable records and pipes new records to trello.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const checkAirtableRecords = async (bot: ExtendedClient) => {
  try {
    const latestId = await readFile(
      join(__dirname, "..", "..", "latestAirtableRecord.txt"),
      "utf-8"
    );
    const records = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?maxRecords=100&sort%5B0%5D%5Bfield%5D=Created&sort%5B0%5D%5Bdirection%5D=desc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_KEY}`,
        },
      }
    );
    const res = (await records.json()) as AirtableResponse;
    const alreadySeenIndex = res.records.findIndex((r) => r.id === latestId);
    if (alreadySeenIndex === 0) {
      return;
    }
    const newRecords = res.records.slice(0, alreadySeenIndex);
    const newLatestId = newRecords[0]?.id as string;

    await writeFile(
      join(__dirname, "..", "..", "latestAirtableRecord.txt"),
      newLatestId,
      "utf-8"
    );

    for (const record of newRecords) {
      const {
        Name: name,
        Reference: images,
        "Contact Method": platform,
        Handle: handle,
        "What would you like us to draw?": note,
        "Anything Else?": additional,
      } = record.fields;
      const files: AttachmentBuilder[] = [];
      for (const imageUrl of images) {
        const image = await fetch(imageUrl.url);
        const imageBuffer = await image.arrayBuffer();
        const imageFinal = Buffer.from(imageBuffer);
        const file = new AttachmentBuilder(imageFinal, {
          name: "reference.png",
        });
        files.push(file);
      }
      await bot.comm.send({
        content: `**FOR:** ${name} - Contact via ${platform}: ${handle}\n\n${note?.slice(
          0,
          1000
        )}\n\n${additional?.slice(0, 1000)}\n\nReferences:`,
        files,
      });
      return;
    }
  } catch (err) {
    await bot.debug.send(
      `Error in check airtable records: ${(err as Error).message}`
    );
  }
};

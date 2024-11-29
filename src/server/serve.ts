import { createHmac } from "crypto";
import { readFile } from "fs/promises";
import http from "http";
import https from "https";

import express from "express";

import { Trello } from "../config/Trello";
import { ExtendedClient } from "../interface/ExtendedClient";

/**
 * Instantiates the web server for listening to webhook payloads.
 *
 * TODO: Delete this entirely once all trello things are done.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const serve = async (bot: ExtendedClient) => {
  const app = express();
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.header("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
<html>
  <head>
    <title>Art 4 Palestine Bot</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="A bot to facilitate our initiative to raise funds for Palestine relief charities by rewarding donors with art." />
    <script
      src="https://kit.fontawesome.com/f949111719.js"
      crossorigin="anonymous"
    ></script>
    <script src="https://widgets.tree-nation.com/js/widgets/v1/widgets.min.js?v=1.0"></script>
    <style>
      :root {
        --foreground: #04624f;
        --background: #abfcecdd;
      }
      body {
        margin: 0;
      }
      body::before {
        background: url(https://cdn.nhcarrigan.com/background.png);
        background-size: cover;
        background-position: center;
        width: 100%;
        height: 100%;
        z-index: -1;
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 1;
        pointer-events: none;
      }
      main {
        color: var(--foreground);
        background-color: var(--background);
        font-family: "JetBrains Mono", monospace;
        text-align: center;
        border-radius: 10px;
        width: 95%;
        max-width: 1080px;
        margin: auto;
      }
      footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--foreground);
        background-color: var(--background);
        position: fixed;
        bottom: 0;
      }
      a {
        color: unset;
      }
    </style>
  </head>
  <body>
    <main>
    <h1>Art 4 Palestine Bot</h1>
    <section>
      <p>A bot to facilitate our initiative to raise funds for Palestine relief charities by rewarding donors with art.</p>
    </section>
    <section>
        <h2>Links</h2>
        <p>
            <a href="https://codeberg.org/nhcarrigan/a4p-bot">
                <i class="fa-solid fa-code"></i> Source Code
            </a>
        </p>
        <p>
            <a href="https://docs.nhcarrigan.com">
                <i class="fa-solid fa-book"></i> Documentation
            </a>
        </p>
        <p>
            <a href="https://chat.nhcarrigan.com">
                <i class="fa-solid fa-circle-info"></i> Support
            </a>
        </p>
    </section>
    </main>
    <footer>
      <p>&copy; Naomi Carrigan</p>
      <a href="https://chat.nhcarrigan.com" target="_blank" rel="noreferrer">
        <i class="fa-solid fa-comments"></i>
      </a>
      <div className="h-4/5" id="tree-nation-offset-website"></div>
      <script id="tree-nation">
        TreeNationOffsetWebsite({
          code: "a17464e0cd351220",
          lang: "en",
          theme: "dark",
        }).render("#tree-nation-offset-website");
      </script>
    </footer>
  </body>
  <video
    autoplay="true"
    loop="true"
    muted="true"
    playsinline="true"
    src="https://cdn.nhcarrigan.com/overlay.webm"
    style="pointer-events: none; position: fixed; top: 0; left: 0; opacity: 0.25;">
  </video>
  <script
      async="true"
      defer="true"
      id="hs-script-loader"
      src="//js.hs-scripts.com/47086586.js"
      type="text/javascript">
  </script>
  <script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="5398ce41-4ceb-4e31-9049-4c784a70179a";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
</html>`);
  });

  const httpServer = http.createServer(app);

  httpServer.listen(10080, async () => {
    await bot.debug.send("http server listening on port 10080");
  });

  if (process.env.NODE_ENV === "production") {
    const privateKey = await readFile(
      "/etc/letsencrypt/live/afp.nhcarrigan.com/privkey.pem",
      "utf8"
    );
    const certificate = await readFile(
      "/etc/letsencrypt/live/afp.nhcarrigan.com/cert.pem",
      "utf8"
    );
    const ca = await readFile(
      "/etc/letsencrypt/live/afp.nhcarrigan.com/chain.pem",
      "utf8"
    );

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca,
    };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(10443, async () => {
      await bot.debug.send("https server listening on port 10443");
    });
  }
};

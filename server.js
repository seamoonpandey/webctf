const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const jwt = require("jwt-simple");

const app = express();
app.use(cookieParser());

// Configurations and Secrets
const SECRET_KEY = crypto.randomBytes(32).toString("hex");
const FLAG = "i-CES{y0u_c@n't_b3lieve_th1s_isn't_@_fl4g!}";
const ADMIN_TOKEN = crypto.randomBytes(16).toString("hex");

// Utility Functions
function createHashToken(data) {
  return crypto
    .createHash("sha256")
    .update(data + SECRET_KEY)
    .digest("hex");
}

function createJwtToken(payload) {
  return jwt.encode(payload, SECRET_KEY);
}

function verifyJwtToken(token) {
  try {
    return jwt.decode(token, SECRET_KEY);
  } catch {
    return null;
  }
}

// Routes
app.get("/", (req, res) => {
  res.send(`
    <!-- Welcome to the ultimate CTF challenge! -->
    <!-- Stage 1: You need the 'Elite-CTF-Browser' to proceed -->
    Try harder...
  `);
});

// Stage 1
app.get("/stage1", (req, res) => {
  const userAgent = req.headers["user-agent"];
  if (userAgent === "Elite-CTF-Browser") {
    const token = createHashToken(userAgent);
    res.cookie("stage1_complete", token, { httpOnly: true });
    res.redirect("/stage2");
  } else {
    res.status(403).send("Invalid browser. Are you even trying?");
  }
});

// Stage 2
app.get("/stage2", (req, res) => {
  const stage1Token = req.cookies.stage1_complete;
  const expectedToken = createHashToken("Elite-CTF-Browser");

  if (stage1Token !== expectedToken) {
    return res.redirect("/");
  }

  res.send(`
    <!-- Stage 2: The Secret Handshake -->
    <!-- Hint: X-CTF-Handshake must be double-encrypted reversed Base64 of 'handshake_secret' -->
  `);
});

app.get("/stage2/verify", (req, res) => {
  const handshake = req.headers["x-ctf-handshake"];
  const secret = "handshake_secret";

  const expected = Buffer.from(
    crypto.createHash("sha256").update(secret).digest("hex")
  )
    .toString("base64")
    .split("")
    .reverse()
    .join("");

  if (handshake === expected) {
    const token = createJwtToken({ stage: 2, completed: true });
    res.cookie("stage2_complete", token, { httpOnly: true });
    res.redirect("/stage3");
  } else {
    res.status(403).send("Wrong handshake! Keep trying.");
  }
});

// Stage 3
app.get("/stage3", (req, res) => {
  const stage2Token = req.cookies.stage2_complete;
  const decoded = verifyJwtToken(stage2Token);

  if (!decoded || !decoded.completed) {
    return res.redirect("/");
  }

  res.cookie("user_role", Buffer.from("user").toString("base64"), {
    httpOnly: true,
  });
  res.send(`
    <!-- Stage 3: Final Challenge -->
    <!-- Hint: Your role must be 'admin' -->
    <!-- Hint: Find the admin token in /time -->
  `);
});

app.get("/stage3/flag", (req, res) => {
  const userRole = req.cookies.user_role;
  const adminHeader = req.headers["x-admin-token"];

  try {
    const role = Buffer.from(userRole, "base64").toString();

    if (role === "admin" && adminHeader === ADMIN_TOKEN) {
      res.json({ success: true, flag: FLAG });
    } else {
      res.status(403).json({
        success: false,
        message: "You must be an admin with the correct token!",
      });
    }
  } catch {
    res.status(400).json({ success: false, message: "Invalid cookie format" });
  }
});

// Breadcrumb: The Time Route
app.get("/time", (req, res) => {
  const reversedToken = ADMIN_TOKEN.split("").reverse().join("");
  const base64Token = Buffer.from(reversedToken).toString("base64");
  res.json({ hint: `${base64Token}` });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`CTF server running on port ${PORT}`);
});

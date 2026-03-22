const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const http = require("http");
const net = require("net");

/** @type {import('child_process').ChildProcess | null} */
let serverProcess = null;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      server.close(() => resolve(port));
    });
  });
}

function waitForServer(port, maxAttempts = 150) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const tryOnce = () => {
      attempts += 1;
      const req = http.get(
        `http://127.0.0.1:${port}/`,
        { timeout: 3000 },
        (res) => {
          res.resume();
          resolve();
        }
      );
      req.on("error", () => {
        if (attempts >= maxAttempts) {
          reject(new Error("timeout waiting for Next.js"));
          return;
        }
        setTimeout(tryOnce, 400);
      });
      req.on("timeout", () => {
        req.destroy();
        if (attempts >= maxAttempts) {
          reject(new Error("timeout waiting for Next.js"));
          return;
        }
        setTimeout(tryOnce, 400);
      });
    };
    tryOnce();
  });
}

function startStandaloneServer(port) {
  const serverDir = path.join(process.resourcesPath, "app-server");
  const serverJs = path.join(serverDir, "server.js");

  if (!fs.existsSync(serverJs)) {
    throw new Error(
      `Missing bundled Next.js server.\nExpected:\n${serverJs}\nRe-run desktop build (electron:build).`
    );
  }

  const env = {
    ...process.env,
    ELECTRON_RUN_AS_NODE: "1",
    PORT: String(port),
    HOSTNAME: "127.0.0.1",
    NODE_ENV: "production",
  };

  const child = spawn(process.execPath, [serverJs], {
    cwd: serverDir,
    env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  const logChunk = (buf, stream) => {
    const s = buf.toString().trim();
    if (s) console[stream](`[next] ${s}`);
  };
  child.stdout?.on("data", (d) => logChunk(d, "log"));
  child.stderr?.on("data", (d) => logChunk(d, "error"));

  child.on("error", (err) => {
    console.error("Next server spawn error:", err);
  });

  child.on("exit", (code, signal) => {
    if (code !== null && code !== 0) {
      console.error(`Next server exited code=${code} signal=${signal}`);
    }
  });

  serverProcess = child;
  return child;
}

function killServer() {
  if (serverProcess && !serverProcess.killed) {
    try {
      serverProcess.kill();
    } catch {
      /* ignore */
    }
    serverProcess = null;
  }
}

function showFatal(title, message) {
  try {
    dialog.showErrorBox(title, message);
  } catch {
    console.error(title, message);
  }
}

async function createWindow() {
  const devUrl = process.env.ELECTRON_DEV_URL || "http://127.0.0.1:3000";
  let loadUrl;

  if (!app.isPackaged) {
    loadUrl = devUrl;
  } else {
    const port = await findFreePort();
    startStandaloneServer(port);
    await new Promise((r) => setTimeout(r, 500));
    try {
      await waitForServer(port);
    } catch (e) {
      const hint =
        e instanceof Error ? e.message : String(e);
      throw new Error(
        `Next.js did not become ready on port ${port}.\n${hint}\nCheck DATABASE_URL and server logs.`
      );
    }
    loadUrl = `http://127.0.0.1:${port}/`;
  }

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.argv.includes("--devtools")) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  win.webContents.on("did-fail-load", (_event, _code, desc, url) => {
    showFatal(
      "Invyno — failed to load page",
      `${desc}\n\n${url}`
    );
  });

  win.once("ready-to-show", () => win.show());

  try {
    await win.loadURL(loadUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    showFatal("Invyno — could not open UI", msg);
    throw err;
  }

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
}

app.whenReady().then(() => {
  createWindow().catch((err) => {
    const msg = err instanceof Error ? err.stack || err.message : String(err);
    showFatal("Invyno — startup failed", msg);
    app.exit(1);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow().catch((e) => {
        showFatal("Invyno — startup failed", String(e));
      });
    }
  });
});

app.on("window-all-closed", () => {
  killServer();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  killServer();
});

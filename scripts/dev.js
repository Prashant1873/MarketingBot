import { spawn } from "child_process";

const isWin = process.platform === "win32";

console.log("\x1b[35m[Marcutie]\x1b[0m Starting local backend (port 3001) and Vite frontend (port 5173)...");

const server = spawn("node", ["server/index.js"], {
  stdio: "inherit",
  shell: true,
});

const client = spawn(isWin ? "npx.cmd" : "npx", ["vite"], {
  stdio: "inherit",
  shell: true,
});

function killProc(proc) {
  if (!proc || !proc.pid) return;
  if (isWin) {
    try {
      spawn("taskkill", ["/pid", proc.pid.toString(), "/T", "/F"], { stdio: "ignore" });
    } catch {
      // Ignore cleanup error
    }
  } else {
    try {
      proc.kill("SIGTERM");
    } catch {
      // Ignore cleanup error
    }
  }
}

function cleanup() {
  console.log("\n\x1b[35m[Marcutie]\x1b[0m Shutting down local services...");
  killProc(server);
  killProc(client);
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

server.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[Server]\x1b[0m Exited with code ${code}`);
  }
});

client.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[Frontend]\x1b[0m Exited with code ${code}`);
  }
});

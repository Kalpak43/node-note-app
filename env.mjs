import fs from "fs";
import path from "path";

export function loadENV() {
  const envPath = path.join(process.cwd(), ".env");

  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, "utf8");
    env.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      process.env[key] = value.replace(/^"|"$/g, '');
    });
  }

  return {
    ...process.env,
  };
}

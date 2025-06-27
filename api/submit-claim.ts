import type { VercelRequest, VercelResponse } from "@vercel/node";
import { writeFile, appendFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { date, category, description } = req.body;

  if (!date || !category || !description) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const logLine = `${new Date().toISOString()} | ${date} | ${category} | ${description}\n`;
  const filePath = path.resolve(process.cwd(), "claims.log");

  try {
    if (!existsSync(filePath)) {
      await writeFile(filePath, logLine);
    } else {
      await appendFile(filePath, logLine);
    }

    return res.status(200).json({ message: "Claim recorded" });
  } catch (err) {
    console.error("[debug] Error writing claim:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

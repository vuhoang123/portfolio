import { readdir, copyFile, access } from "node:fs/promises";
import path from "node:path";

// Next 16's Windows exporter preserves backslashes in segment filenames,
// creating nested folders while the browser requests dot-separated files.
// Keep the original output and add the expected static aliases.
const output = path.resolve("out");
let aliases = 0;

async function collectFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(filename));
    else if (entry.isFile() && entry.name.endsWith(".txt")) files.push(filename);
  }
  return files;
}

async function normalize(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const nested = path.join(directory, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const filename of await collectFiles(nested)) {
        const relative = path.relative(directory, filename);
        const alias = path.join(directory, relative.split(path.sep).join("."));
        try {
          await access(alias);
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
          await copyFile(filename, alias);
          aliases++;
        }
      }
    } else {
      await normalize(nested);
    }
  }
}

await normalize(output);
console.log(`Static segment aliases: ${aliases}`);

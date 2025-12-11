import { promises as fs } from "fs";
import path from "path";
import { TSXFile } from "../types";

const isValidPath = async (inputPath: string): Promise<boolean> => {
  return await fs.stat(inputPath).then(() => true).catch(() => false);
}

type LineRange = { 
  startLine: number, 
  endLine: number
};

export const readFile = async (
  filePath: string,
  range?: LineRange
): Promise<TSXFile> => {
  const content = await fs.readFile(filePath, "utf-8");

  if (range) {
    return { 
      path: filePath, 
      content: content.split("\n").slice(range.startLine - 1, range.endLine).join("\n") 
    };
  }

  return { path: filePath, content };
}

const readDirectory = async (dirPath: string): Promise<TSXFile[]> => {
  const directoryEntries = await fs.readdir(dirPath, { withFileTypes: true });

  const filePromises = directoryEntries.map(async (entry) => {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      return readDirectory(fullPath);
    }

    if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".html"))) {
      return readFile(fullPath);
    }

    return [];
  });

  const files = await Promise.all(filePromises);

  return files.flat();
}

export async function readFiles(inputPath: string): Promise<TSXFile[]> {
  if (!isValidPath(inputPath)) {
    console.log("Please provide a valid directory");
    process.exit(0);
  }

  const stats = await fs.stat(inputPath);

  if (stats.isFile() && (inputPath.endsWith(".ts") || inputPath.endsWith(".html"))) {
    return [await readFile(inputPath)];
  }

  if (stats.isDirectory()) {
    return readDirectory(inputPath);
  }

  console.log("The provided path is neither a valid file or a directory");
  process.exit(0);
}

#!/usr/bin/env node

import { analyze } from "./analyzer";
import { logger } from "./utils/logger";

const pathToDir = process.argv[2];

if(!pathToDir) {
  console.error("Please provide a directory path as an argument.");
  process.exit(1);
}

const run = async (pathToDir: string) => {
  const analysisResult = await analyze(pathToDir);
  console.log(process.cwd())

  console.table(logger(analysisResult));
}

run(pathToDir);
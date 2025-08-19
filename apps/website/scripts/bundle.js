#!/usr/bin/env node
import { createWriteStream, readFileSync } from "node:fs";
import { resolve } from "node:path";
import archiver from "archiver";

const package_json = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../package.json")),
);

const output = createWriteStream(
  resolve(
    import.meta.dirname,
    `../dist/isTrust-${package_json.name}-${package_json.version}.zip`,
  ),
);
const archive = archiver("zip");

archive.directory(resolve(import.meta.dirname, "../dist/website"), ".");

archive.pipe(output);
archive.finalize();

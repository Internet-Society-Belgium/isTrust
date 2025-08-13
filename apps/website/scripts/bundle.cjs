const fs = require("node:fs");
const path = require("node:path");
const archiver = require("archiver");

const package_json = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package.json")),
);

const output = fs.createWriteStream(
  path.resolve(
    __dirname,
    `../dist/isTrust-${package_json.name}-${package_json.version}.zip`,
  ),
);
const archive = archiver("zip");

archive.directory(path.resolve(__dirname, "../dist/website"), ".");

archive.pipe(output);
archive.finalize();

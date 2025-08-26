#!/usr/bin/env node
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import package_json from "../../../package.json" with { type: "json" };

const dirPath = dirname(import.meta.filename);

rmSync(join(dirPath, "../dist/xcode"), { recursive: true, force: true });

// if PATH error
// sudo xcode-select --switch /Applications/Xcode.app
execSync(
  `xcrun safari-web-extension-converter --project-location xcode --app-name isTrust --bundle-identifier be.isoc.istrust --copy-resources safari-mv2`,
  {
    cwd: join(dirPath, "../dist"),
  },
);

const version = package_json.version;

const xcodePath = join(dirPath, "../dist/xcode");

const projectPath = join(
  xcodePath,
  "isTrust/isTrust.xcodeproj/project.pbxproj",
);
let project = await readFile(projectPath, { encoding: "utf-8" });
project = project.replaceAll(
  "MARKETING_VERSION = 1.0;",
  `MARKETING_VERSION = ${version};`,
);
project = project.replaceAll(
  "PRODUCT_BUNDLE_IDENTIFIER = be.isoc.isTrust;",
  "PRODUCT_BUNDLE_IDENTIFIER = be.isoc.istrust;",
);
project = project.replaceAll(
  "PRODUCT_BUNDLE_IDENTIFIER = be.isoc.isTrust.Extension;",
  "PRODUCT_BUNDLE_IDENTIFIER = be.isoc.istrust.extension;",
);
project = project.replaceAll(
  "INFOPLIST_KEY_CFBundleDisplayName = isTrust;",
  'INFOPLIST_KEY_CFBundleDisplayName = isTrust;\nINFOPLIST_KEY_LSApplicationCategoryType = "public.app-category.utilities";',
);
writeFile(projectPath, project);

const viewControllerPath = join(
  xcodePath,
  "isTrust/Shared (App)/ViewController.swift",
);
let viewController = await readFile(viewControllerPath, { encoding: "utf-8" });
viewController = viewController.replaceAll(
  'let extensionBundleIdentifier = "be.isoc.isTrust.Extension"',
  'let extensionBundleIdentifier = "be.isoc.istrust.extension"',
);
writeFile(viewControllerPath, viewController);

const macOSInfoPlistPath = join(xcodePath, "isTrust/macOS (App)/Info.plist");
let macOSInfoPlist = await readFile(macOSInfoPlistPath, { encoding: "utf-8" });
macOSInfoPlist = macOSInfoPlist.replaceAll(
  "<dict>",
  "<dict>\n<key>ITSAppUsesNonExemptEncryption</key>\n<false/>",
);
writeFile(macOSInfoPlistPath, macOSInfoPlist);

const iOSInfoPlistPath = join(xcodePath, "isTrust/iOS (App)/Info.plist");
let iOSInfoPlist = await readFile(iOSInfoPlistPath, { encoding: "utf-8" });
iOSInfoPlist = iOSInfoPlist.replaceAll(
  "<dict>",
  "<dict>\n<key>ITSAppUsesNonExemptEncryption</key>\n<false/>",
);
writeFile(iOSInfoPlistPath, iOSInfoPlist);

const macOSEntitlementsPath = join(
  xcodePath,
  "isTrust/macOS (App)/isTrust.entitlements",
);
let macOSEntitlements = await readFile(macOSEntitlementsPath, {
  encoding: "utf-8",
});
macOSEntitlements = macOSEntitlements.replaceAll(
  "	<key>com.apple.security.files.user-selected.read-only</key>\n	<true/>",
  "",
);
writeFile(macOSEntitlementsPath, macOSEntitlements);

console.log("----------");
console.log("Go to isTrust (file tree root)");
console.log("----- App -----");
console.log("Go to isTrust (...)");
console.log("Go to Signing & Capabilities");
console.log("Team: Internet Society Chapter Begium");
console.log("Remove unused permission");
console.log("----- Extension -----");
console.log("Go to isTrust Extension (...)");
console.log("Go to Signing & Capabilities");
console.log("Team: Internet Society Chapter Begium");
console.log("Remove unused permission");
console.log("Go to Product > Archive");
console.log("Validate App (Window > Organize)");
console.log("Distribute App (Window > Organize)");

#!/bin/sh

rm -rf safari/
xcrun safari-web-extension-converter $PWD/build --project-location $PWD/safari --app-name isTrust --bundle-identifier be.isoc.istrust --swift --macos-only --copy-resources
echo "Go to isTrust > Target > isTrust"
echo "App Category: Utilities"
echo "Bundle Identifier: be.isoc.istrust"
echo "Version: ..."
echo "Go to ... > Signing & Capabilities"
echo "Remove unused permission"
echo "Go to isTrust > Target > isTrust Extension"
echo "Bundle Identifier: be.isoc.istrust.extension"
echo "Version: ..."
echo "Go to ... > Signing & Capabilities"
echo "Remove unused permission"
echo "Go to Product > Archive"
echo "Distribute App (Window > Organize)"

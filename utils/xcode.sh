#!/bin/sh

rm -rf safari/
xcrun safari-web-extension-converter $PWD/build --project-location $PWD/safari --app-name isTrust --bundle-identifier be.isoc.istrust --swift --macos-only --copy-resources
echo "Go to isTrust > Target > isTrust"
echo "App Category: Utilities"
echo "Version: ..."
echo "Go to isTrust > Target > isTrust Extension"
echo "Version: ..."

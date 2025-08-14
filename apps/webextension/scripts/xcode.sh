#!/bin/sh

# if PATH error: sudo xcode-select -switch /Applications/Xcode.app

cd $PWD/dist/
rm -rf ./xcode

xcrun safari-web-extension-converter --project-location xcode --app-name isTrust --bundle-identifier be.isoc.istrust --copy-resources safari-mv2

echo ""
echo "Go to isTrust (file tree root)"
echo "----- App -----"
echo "Go to isTrust (...)"
echo "App Category: Utilities"
echo "Bundle Identifier: be.isoc.istrust"
echo "Version: ..."
echo "Go to Signing & Capabilities"
echo "Team: Internet Society Chapter Begium"
echo "Remove unused permission"
echo "----- Extension -----"
echo "Go to isTrust Extension (...)"
echo "Bundle Identifier: be.isoc.istrust.extension"
echo "Version: ..."
echo "Go to Signing & Capabilities"
echo "Team: Internet Society Chapter Begium"
echo "Remove unused permission"
echo "----- Archive -----"
echo "Go to Product > Archive"
echo "Validate App (Window > Organize)"
echo "Distribute App (Window > Organize)"

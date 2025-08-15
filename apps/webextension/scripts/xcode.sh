#!/bin/sh

# if PATH error: sudo xcode-select -switch /Applications/Xcode.app

cd $PWD/dist/
rm -rf ./xcode

xcrun safari-web-extension-converter --project-location xcode --app-name isTrust --bundle-identifier be.isoc.istrust --copy-resources safari-mv2

version=$(npm pkg get version --workspaces=false | tr -d \")
sed -i.bak -e "s/MARKETING_VERSION = 1.0;/MARKETING_VERSION = $version;/g" ./xcode/isTrust/isTrust.xcodeproj/project.pbxproj
sed -i.bak -e "s/PRODUCT_BUNDLE_IDENTIFIER = be.isoc.isTrust;/PRODUCT_BUNDLE_IDENTIFIER = be.isoc.istrust;/g" ./xcode/isTrust/isTrust.xcodeproj/project.pbxproj
sed -i.bak -e "s/PRODUCT_BUNDLE_IDENTIFIER = be.isoc.isTrust.Extension;/PRODUCT_BUNDLE_IDENTIFIER = be.isoc.istrust.extension;/g" ./xcode/isTrust/isTrust.xcodeproj/project.pbxproj
sed -i.bak -e "s/INFOPLIST_KEY_CFBundleDisplayName = isTrust;/INFOPLIST_KEY_CFBundleDisplayName = isTrust;\nINFOPLIST_KEY_LSApplicationCategoryType = \"public.app-category.utilities\";/g" ./xcode/isTrust/isTrust.xcodeproj/project.pbxproj

sed -i.bak -e "s/<dict>/<dict>\n<key>ITSAppUsesNonExemptEncryption<\/key>\n<false\/>/g" "./xcode/isTrust/macOS (App)/Info.plist"
sed -i.bak -e "s/<dict>/<dict>\n<key>ITSAppUsesNonExemptEncryption<\/key>\n<false\/>/g" "./xcode/isTrust/iOS (App)/Info.plist"

echo "----------"
echo "Go to isTrust (file tree root)"
echo "----- App -----"
echo "Go to isTrust (...)"
# echo "App Category: Utilities"
# echo "Bundle Identifier: be.isoc.istrust"
# echo "Version: ..."
echo "Go to Signing & Capabilities"
echo "Team: Internet Society Chapter Begium"
echo "Remove unused permission"
echo "----- Extension -----"
echo "Go to isTrust Extension (...)"
# echo "Bundle Identifier: be.isoc.istrust.extension"
# echo "Version: ..."
echo "Go to Signing & Capabilities"
echo "Team: Internet Society Chapter Begium"
echo "Remove unused permission"

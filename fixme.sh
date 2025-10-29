#! /bin/bash

cd random-item-purchase-system/api-server
rm -rf node_modules
cd ../web-server
rm -rf node_modules
cd ../..
git add .
git commit -m "fix: remove node_modules"
echo node_modules/ >> .gitignore
git add .
git commit -ma "fix: add node_modules to gitignore"
git push

cd random-item-purchase-system/api-server
npm install
cd ../web-server
npm install
cd ../..
git add .
git commit -m "fix: install package-lock.json"
git push
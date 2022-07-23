#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('node:child_process');

const currDir = process.cwd();
const templateDir = path.join(__dirname, '../src/');

if (fs.existsSync(path.resolve(currDir, 'package.json')) === false) {
    console.log(`Current directory does not resemble the root directory of a Node.js package.\nPlease use npm init first.`);
    process.exit(1);
}

const currPackageJson = JSON.parse(fs.readFileSync(path.resolve(currDir, 'package.json')));
if (currPackageJson.hasOwnProperty('dependencies') === false) {
    currPackageJson['dependencies'] = {};
}
console.log('Adding dependencies to package.json');
const dependencies = {
    "await-timeout": "^1.1.1",
    "formdata-node": "^4.3.3",
    "randomized-string": "^1.2.6",
    "rtgg.js": "^2.1.1",
    "ws": "^8.8.1"
};
for (const dependency in dependencies) {
    if (currPackageJson.dependencies.hasOwnProperty(dependency) === false) {
        currPackageJson.dependencies[dependency] = dependencies[dependency];
    }
}
fs.writeFileSync(path.resolve(currDir, 'package.json'), JSON.stringify(currPackageJson, null, 2));
console.log('package.json updated');

console.log('Copying files');
const fileDirectory = fs.existsSync(path.resolve(currDir, 'src')) ? '_src' : 'src';
fs.mkdirSync(path.resolve(currDir, fileDirectory));
const files = fs.readdirSync(templateDir);
files.forEach(file => {
    const contents = fs.readFileSync(path.resolve(templateDir, file));
    fs.writeFileSync(path.resolve(currDir, fileDirectory, file), contents);
});
console.log(`Files copied into ${path.resolve(currDir, fileDirectory)}`);

console.log('Installing dependencies');
execSync('npm i');
console.log('Dependencies installed');
console.log('Exiting...');
process.exit(1);
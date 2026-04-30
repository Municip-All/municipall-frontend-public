/* eslint-disable */
const fs = require('fs');

let homeHtml = fs.readFileSync('src/test.html', 'utf8').split('id="view-home"')[1].split('id="view-sig"')[0];
let sigHtml = fs.readFileSync('src/test.html', 'utf8').split('id="view-sig"')[1].split('id="view-demandes"')[0];

console.log("Got HTML chunks, mapping them to React format...");
// In practice I'll just write out the complete TSX files based on what's already there and what the user wants.

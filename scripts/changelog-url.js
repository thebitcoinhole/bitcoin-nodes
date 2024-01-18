const fs = require('fs');

const itemId = process.argv[2];
var jsonFile = fs.readFileSync(`../items/${itemId}.json`, 'utf8')
const jsonData = JSON.parse(jsonFile);

console.log(jsonData[`firmware`][`release-notes`]["links"][0]["url"]);

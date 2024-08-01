const fs = require('fs');

const itemId = process.argv[2];
var jsonFile = fs.readFileSync(`../items/${itemId}.json`, 'utf8')
const jsonData = JSON.parse(jsonFile);

if (jsonData[`firmware`][`release-notes`]["links"] && 
    jsonData[`firmware`][`release-notes`]["links"].length > 0) {
    console.log(jsonData[`firmware`][`release-notes`]["links"][0]["url"]);
}

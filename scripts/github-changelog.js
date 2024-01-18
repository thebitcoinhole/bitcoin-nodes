require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const itemId = process.argv[2];
const changelogUrl = process.argv[3];

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

var latestVersion
var latestReleaseDate

axios
  .get(changelogUrl)
  .then((response) => {
    var body = response.data
    // Split the content into lines
    const lines = body.split('\n');

    // Find the first line starting with "##"
    var regex = /^## \[([\d.]+)\] \(([^)]+)\)/;
    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            latestVersion = "v" + match[1];
            latestReleaseDate = formatDate(match[2]);
            break;
        }
    }

    if (latestVersion == undefined || latestReleaseDate == undefined) {
        const regex = /^## ([\d.]+) \[([^)]+)\]/;
        for (const line of lines) {
            const match = line.match(regex);
            if (match) {
                latestVersion = "v" + match[1];
                latestReleaseDate = formatDate(match[2]);
                break;
            }
        }
    }

    // Parmanode
    if (latestVersion == undefined || latestReleaseDate == undefined) {
        const line = lines[0]
        const regex = /^Version ([\d.]+)/;
        const match = line.match(regex);
        if (match) {
            latestVersion = "v" + match[1];
            latestReleaseDate = now();
        }
    }

    // My Node
    // === v0.3.25 ===
    // - Released 1/11/24
    if (latestVersion == undefined || latestReleaseDate == undefined) {
        var line = lines[0]
        regex = /^=== v([\d.]+) ===/;
        var match = line.match(regex);
        if (match) {
            latestVersion = "v" + match[1];

            line = lines[1]
            regex = /^- Released ([\d.]+)\/([\d.]+)\/([\d.]+)/;
            if (match) {
                match = line.match(regex);
                latestReleaseDate = `${months[parseInt(match[1]) - 1]} ${match[2]}, ${2000 + parseInt(match[3])}`;
            }
        }
    }

    console.log(`Sanitized version: ${latestVersion}`);
    console.log(`Release Date: ${latestReleaseDate}`);
    updateJson(itemId, latestVersion, latestReleaseDate);

  })
  .catch((error) => {
    console.error('Error fetching release information:', error.message);
    process.exit(1);
  });

function now() {
    const isoString = new Date().toISOString();
    return new Date(isoString.split('.')[0] + 'Z').toLocaleDateString(undefined, dateOptions);
}

function formatDate(inputDate) {  
    // Split the input date string into parts
    const parts = inputDate.match(/(\d+)\w+\s(\w+)\s(\d+)/);
  
    if (parts && parts.length === 4) {
      const day = parseInt(parts[1]);
      const monthIndex = months.indexOf(parts[2]);
      const year = parseInt(parts[3]);
  
      if (monthIndex !== -1) {
        // Create a JavaScript Date object
        const date = new Date(year, monthIndex, day);
  
        // Format the date in the desired output format (e.g., "Jul 27, 2023")
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      }
    }
  
    // Return the original input if parsing fails
    return inputDate;
  }

function updateJson(itemId, latestVersion, latestReleaseDate) {
    // Define the path to your JSON file.
    const filePath = `../items/${itemId}.json`;

    // Read the JSON file.
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            process.exit(1);
            return;
        }

        try {
            const item = JSON.parse(data);
            var modifyJson = false

            var currentVersion = item["firmware"]["latest-version"].value
            console.log("Current version found: " + currentVersion)
            var currentReleaseDate = item["firmware"]["latest-release-date"].value
            console.log("Current Release date found: " + currentReleaseDate)
            if (latestVersion !== currentVersion) {
                item["firmware"]["latest-version"].value = latestVersion
                item["firmware"]["latest-release-date"].value = latestReleaseDate
                modifyJson = true
            }

            if (modifyJson) {
                console.log("Updating JSON")

                // Convert the modified object back to a JSON string.
                const updatedJsonString = JSON.stringify(item, null, 2);

                // Write the updated JSON string back to the file.
                fs.writeFile(filePath, updatedJsonString, (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing JSON file:', writeErr);
                    } else {
                        console.log('JSON file updated successfully.');
                    }
                });
            }

        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            process.exit(1);
        }
    });
}

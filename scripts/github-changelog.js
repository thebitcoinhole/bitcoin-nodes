require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const itemId = process.argv[2];
const changelogUrl = process.argv[3];

var latestVersion
var latestReleaseDate

axios
  .get(changelogUrl)
  .then((response) => {
    var body = response.data
    // Split the content into lines
    const lines = body.split('\n');

    // Find the first line starting with "##"
    const regex = /^## \[([\d.]+)\] \(([^)]+)\)/;
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
        latestVersion = "v" + match[1];
        latestReleaseDate = "?"
    }

    console.log(`Sanitized version: ${latestVersion}`);
    console.log(`Release Date: ${latestReleaseDate}`);
    updateJson(itemId, latestVersion, latestReleaseDate);

  })
  .catch((error) => {
    console.error('Error fetching release information:', error.message);
    process.exit(1);
  });

function formatDate(inputDate) {
    // Define months for formatting
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
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
        const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        return formattedDate;
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
            const wallet = JSON.parse(data);
            var modifyJson = false

            console.log("Updating hardware wallet firmware")

            var currentVersion = wallet["firmware"]["latest-version"].value
            console.log("Current version found: " + currentVersion)
            if (latestVersion !== currentVersion) {
                wallet["firmware"]["latest-version"].value = latestVersion
                modifyJson = true
            }
            
            var currentReleaseDate = wallet["firmware"]["latest-release-date"].value
            if (latestReleaseDate !== currentReleaseDate) {
                wallet["firmware"]["latest-release-date"].value = latestReleaseDate
                modifyJson = true
            }
            console.log("Current Release date found: " + currentReleaseDate)

            if (modifyJson) {
                // Convert the modified object back to a JSON string.
                const updatedJsonString = JSON.stringify(wallet, null, 2);

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

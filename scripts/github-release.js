require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const itemId = process.argv[2];
const owner = process.argv[3];
const repo = process.argv[4];
const releases = process.argv[5];
const apiKey = process.argv[6];

var apiUrl = `https://api.github.com/repos/${owner}/${repo}/tags`;
if (releases == "true") {
    apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
}

const headers = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: `Bearer ${apiKey}`,
};

const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
var latestReleaseDate
var assetFileNames = [];

axios
  .get(apiUrl, { headers })
  .then((response) => {

    var latestVersion
    var assets = []
    var body = ""
    var publishedAt = ""
    if (releases == "true") {
        console.log("Using releases API")

        body = response.data.body
        publishedAt = response.data.published_at
        assets = response.data.assets
        latestVersion = response.data.name
        console.log("Release name: " + latestVersion)
        if (latestVersion === undefined || latestVersion === "") {
            latestVersion = response.data.tag_name
            console.log("Tag name: " + latestVersion)
        }
    } else {
        console.log("Using tags API")
        const tags = response.data;
        latestTag = tags[0];
        latestVersion = latestTag.name
        console.log("Tag name: " + latestVersion)
        publishedAt = fetchTagPublishDate(latestTag.name)
    }

    if (!ignoreVersion(itemId, latestVersion)) {

        // MiniBolt
        latestVersion = latestVersion.replace(/^MiniBolt /, '');

        // Bitcoin Core
        latestVersion = latestVersion.replace(/^Bitcoin Core /, '');

        // Umbrel
        latestVersion = latestVersion.replace(/^umbrelOS /, '');

        // Check if the input starts with "v" and is a valid version (x.y.z)
        const versionPattern = /^v\d+(\.\d+)*$/;
        if (!versionPattern.test(latestVersion)) {
            // If it doesn't match the version pattern, add the "v" prefix
            latestVersion = "v" + latestVersion;
        }

        // Iterate through release assets and collect their file names
        assets.forEach((asset) => {
            assetFileNames.push(asset.name);
        });

        if (publishedAt != "") {
            latestReleaseDate = new Date(publishedAt).toLocaleDateString(undefined, dateOptions);
        } else {
            latestReleaseDate = "?"
        }

        console.log(`Sanitized version: ${latestVersion}`);
        console.log(`Release Date: ${latestReleaseDate}`);
        console.log('Release Notes:\n', body);
        console.log('Asset File Names:\n', assetFileNames.join('\n'));
        updateJson(itemId, latestVersion, latestReleaseDate);
    } else {
        console.log("Ignoring version")
    }
  })
  .catch((error) => {
    console.error('Error fetching release information:', error.message);
    process.exit(1);
  });

function ignoreVersion(itemId, latestVersion) {

    // Ignore if it ends with "-pre1", "-pre2", etc.
    var pattern = /-pre\d+$/;
    if (pattern.test(latestVersion)) {
        return true
    }

    // Ignore if it ends with "-rc", "-rc1", "-rc2", etc.
    pattern = /-rc\d*$/;
    if (pattern.test(latestVersion)) {
        return true
    }

    return false
}

function fetchTagPublishDate(tagName) {
    // TODO
    return ""
  }

function updateJson(itemId, latestVersion, latestReleaseDate) {
    // Define the path to your JSON file.
    const filePath = `../items/${itemId}.json`;

    // Read the JSON file.
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            process.exit(1);
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

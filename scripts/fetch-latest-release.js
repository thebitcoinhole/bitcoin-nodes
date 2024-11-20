require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const itemId = process.argv[2];
const changelogUrl = process.argv[3];
const githubOwner = process.argv[4];
const githubRepo = process.argv[5];
const gitlabProjectId = process.argv[6];
const tag = process.argv[7];
const latestRelease = process.argv[8];
const allReleases = process.argv[9];
const allReleasesInclude = process.argv[10];
const allReleasesExclude = process.argv[11];

const githubApiKey = process.env.GITHUB_TOKEN
const gitlabApiKey = process.env.GITLAB_TOKEN

const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

var headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${githubApiKey}`,
  };
var apiUrl 
if (tag == "true") {
    if (gitlabProjectId != "null") {
        headers = {
            Authorization: `Bearer ${gitlabApiKey}`
          };
        apiUrl = `https://gitlab.com/api/v4/projects/${gitlabProjectId}/repository/tags`;
    } else {
        apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/tags`;
    }
} else if (latestRelease == "true") {
    apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/releases/latest`;
} else if (allReleases == "true") {
    apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/releases`;
} else if (changelogUrl != "null") {
    apiUrl = changelogUrl
    headers = {}
} else {
    console.error('Not defined api url to use');
    process.exit(1);
}

const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
var latestVersion
var latestReleaseDate
// var assetFileNames = [];

console.log("Request url: " + apiUrl)
axios
  .get(apiUrl, { headers })
  .then((response) => {

    // var assets = []
    var body = ""
    if (latestRelease == "true") {
        console.log("Using latest releases API")
        body = response.data.body

        latestReleaseDate = getDate(response.data.published_at)
        //assets = response.data.assets
        latestVersion = response.data.name.trim()
        console.log("Release name: " + latestVersion)
        if (latestVersion === undefined || latestVersion === "") {
            latestVersion = response.data.tag_name.trim()
            console.log("Tag name: " + latestVersion)
        }
    } else if (allReleases == "true") {
        console.log("Using releases API")
        response.data.forEach((release) => {
            if (latestVersion === undefined) {
                var match = false
                if (allReleasesInclude != undefined && allReleasesInclude != "null") {
                    match = release.name.toLowerCase().includes(allReleasesInclude.toLowerCase())
                } else if (allReleasesExclude != undefined && allReleasesExclude != "null") {
                    match = !release.name.toLowerCase().includes(allReleasesExclude.toLowerCase())
                } else {
                    console.error('Not defined any allReleasesInclude or allReleasesExclude');
                    process.exit(1);
                }
                if (match) {
                    body = release.body
                    latestReleaseDate = getDate(release.published_at)
                    //assets = release.assets
                    latestVersion = release.name.trim()
                    console.log("Release name: " + latestVersion)
                    if (latestVersion === undefined || latestVersion === "") {
                        latestVersion = release.tag_name
                        console.log("Tag name: " + latestVersion)
                    }
                }
            }
        });
    } else if (tag == "true") {
        console.log("Using tags API")
        const tags = response.data;
        latestTag = tags[0];
        latestVersion = latestTag.name.trim()
        console.log("Tag name: " + latestVersion)
        latestReleaseDate = today()
    } else if (changelogUrl != "null") {
        var body = response.data
        // Split the content into lines
        const lines = body.split('\n');

        if (itemId == "parmanode") {
            const regex = /^Version ([\d.]+)/;
            for (const line of lines) {
                // Skip empty lines and lines starting with #
                if (line.trim() === "" || line.trim().startsWith("#")) {
                    continue;
                }
            
                const match = line.match(regex);
                if (match) {
                    latestVersion = match[1];
                    latestReleaseDate = today();
                    break; // Stop after finding the first valid version line
                }
            }
        } else if (itemId.startsWith("mynode-")) {
            // === v0.3.25 ===
            // - Released 1/11/24
            var line = lines[0]
            regex = /^=== v([\d.]+) ===/;
            var match = line.match(regex);
            if (match) {
                latestVersion = match[1];
                line = lines[1]
                regex = /^- Released ([\d.]+)\/([\d.]+)\/([\d.]+)/;
                if (match) {
                    match = line.match(regex);
                    latestReleaseDate = `${shortMonths[parseInt(match[1]) - 1]} ${match[2]}, ${2000 + parseInt(match[3])}`;
                }
            }
        } else if (itemId.startsWith("nodl-")) {
            const line = lines[0]
            const regex = /^([\d.]+) -/;
            const match = line.match(regex);
            if (match) {
                latestVersion = match[1];
                latestReleaseDate = today();
            }
        } else {
            console.error("Date parser not found")
            process.exit(1);
        }
        
        if (latestVersion == undefined) {
            console.error("latestVersion not found")
            process.exit(1);
        }

        if (latestReleaseDate == undefined) {
            console.error("latestReleaseDate not found")
            process.exit(1);
        }
    }

    if (!ignoreVersion(itemId, latestVersion)) {

        // MiniBolt
        latestVersion = latestVersion.replace(/^MiniBolt /, '');

        // Bitcoin Core
        latestVersion = latestVersion.replace(/^Bitcoin Core /, '');

        // Bitcoin Knots
        latestVersion = latestVersion.replace(/^Bitcoin Knots /, '');
        latestVersion = latestVersion.replace(/knots/, '');

        // Umbrel
        latestVersion = latestVersion.replace(/^umbrelOS /, '');

        // Raspibolt
        latestVersion = latestVersion.replace(/^RaspiBolt /, '');

        latestVersion = latestVersion.replace(/^(v\d+(\.\d+)+):(.*)$/, '$1');
        latestVersion = latestVersion.replace(/^Release\s*/, '');
        latestVersion = latestVersion.replace(/^release_/, '');

        // Check if the input starts with "v" and is a valid version (x.y.z)
        const versionPattern = /^v\d+(\.\d+)*$/;
        if (!versionPattern.test(latestVersion)) {
            // If it doesn't match the version pattern, add the "v" prefix
            latestVersion = "v" + latestVersion;
        }

        if (!isValidVersion(latestVersion)) {
            console.error('Invalid version found:' + latestVersion);
            process.exit(1);
        }

        if (!isValidDate(latestReleaseDate)) {
            console.error('Invalid release data found:' + latestReleaseDate);
            process.exit(1);
        }

        // Iterate through release assets and collect their file names
        // assets.forEach((asset) => {
        //     assetFileNames.push(asset.name);
        // });
        //console.log('Release Notes:\n', body);
        //console.log('Asset File Names:', assetFileNames.join());
        checkRelease(itemId, latestVersion, latestReleaseDate);
    } else {
        console.log("Ignoring version")
        console.log("releaseVersion=")
        console.log("releaseDate=")
    }
  })
  .catch((error) => {
    console.error('Error fetching release information:', error.message);
    process.exit(1);
  });

function isValidVersion(str) {
    const regex = /^v\d+(\.\d+)*$/;
    return regex.test(str);
}

function isValidDate(str) {
    const regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [1-9]|[1-2][0-9]|3[01], \d{4}$/;
    return regex.test(str);
}

function getDate(publishedAt) {
    if (publishedAt != "") {
        return new Date(publishedAt).toLocaleDateString(undefined, dateOptions);
    } else {
        return today()
    }
}

function ignoreVersion(itemId, latestVersion) {

    // Ignore if it ends with "-pre1", "-pre2", etc.
    var pattern = /-pre\d+$/;
    if (pattern.test(latestVersion)) {
        return true
    }

    // umbrelOS 1.2 Beta 1
    if (latestVersion.toLowerCase().includes("beta")) {
        return true
    }

    // Ignore if it ends with "-rc", "-rc1", "-rc2", etc.
    pattern = /-rc\d*$/;
    if (pattern.test(latestVersion)) {
        return true
    }

    return false
}

function today() {
    return new Date().toLocaleDateString(undefined, dateOptions);
}

function checkRelease(itemId, latestVersion, latestReleaseDate) {
    // Define the path to your JSON file.
    const filePath = `../items/${itemId}.json`;

    // Read the JSON file.
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            process.exit(1);
        }

        try {
            const item = JSON.parse(data);
            var currentVersion = item["firmware"]["latest-version"].value
            console.log("Current version found: " + currentVersion)
            console.log("Latest version found: " + latestVersion)

            var currentReleaseDate = item["firmware"]["latest-release-date"].value
            console.log("Current Release date found: " + currentReleaseDate)
            console.log("Latest Release date found: " + latestReleaseDate)

            if (latestVersion !== currentVersion) {
                console.log("releaseVersion=" + latestVersion)
                console.log("releaseDate=" + latestReleaseDate)
            } else {
                console.log("releaseVersion=")
                console.log("releaseDate=")
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            process.exit(1);
        }
    });
}

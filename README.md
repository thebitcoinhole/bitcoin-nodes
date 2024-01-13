# The Bitcoin Hole - Bitcoin Nodes

## Introduction

For bitcoin to function reliably and securely, it relies on the voluntary participation of thousands of individuals worldwide. Nodes, which make up the bitcoin network and verify transactions and blocks, are crucial to this process. There are many reasons to consider running your own bitcoin node, including personal benefits and the benefits to the security and resilience of the bitcoin ecosystem.

## Collaboration

Inside the `items` directory, there is a JSON file for each node, with all the data about it. To collaborate (adding missing data, fixing wrong data or adding a new node), just fork the repository and send a pull request with the changes.

## JSON format

The following is a sample of the JSON format:

```json
{
    "id": "item-id",
    "name": "Item Name",
    "purchasable": true,
    "pre-order": false,
    "category-name": {
      "feature-name-1": {
        "value": "YES", 
        "flag": "positive",
        "supported": true,
        "texts": [
          "Optional contextual text describing the feature"
        ],
        "links": [
          {
            "title": "Optional contextual link referencing official documentation",
            "url": "url"
          }
        ]
      },
      "feature-name-2": {
        "value": "Experimental",
        "flag": "neutral",
        "supported": true
      },
      "feature-name-3": {
        "value": "NO",
        "flag": "negative",
        "supported": false
      }
    }
}
```

JSON fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | true | The item id. It matches with the JSON file name. |
| name | string | true | The item name. |
| purchasable | boolean | true | If the item can be purchased in the official website |
| pre-order | boolean | false | If the item is not released yet and can be reserved/pre-ordered |
| category-name.feature-name-1.value | string | yes | The visible feature value. For example: `"YES"`, `"NO"`, `"Experimental"`, etc |
| category-name.feature-name-1.flag | string | no | The flag of the item feature. Possible values: `"positive"`, `"neutral"` or `"negative"` |
| category-name.feature-name-1.supported | boolean | no | If the feature is supported by the item. This is used to filter by this feature |
| category-name.feature-name-1.texts | array of strings | no | Official Texts with info about the feature |
| category-name.feature-name-1.links | array of objects | no | Official links with info about the feature |
| category-name.feature-name-1.links.title | string | yes | The title of the link |
| category-name.feature-name-1.links.url | string | yes | The url of the link |

On each pull request, the JSON files are verified to be sure they are valid and well-formatted. You can run the following command inside the `scripts` directory to format the JSON before sending a pull request:

```
node json-format.js
```

All the features supported:

| Category | Category Id | Feature | Feature Id |
| --- | --- | --- | --- |
| Basic Information | basic-information | Price | price |
| Basic Information | basic-information | Discounts | discounts |
| Basic Information | basic-information | Launch Year | year |
| Basic Information | basic-information | Form Factor | form-factor |
| Company | company | Brand | brand |
| Company | company | Headquarters | headquarters |
| Company | company | Website | website |
| Company | company | Blog | blog |
| Company | company | X (Twitter) | twitter |
| Company | company | Nostr | nostr |
| Company | company | YouTube | youtube |
| Company | company | GitHub / GitLab | github |
| Communities | communities | Telegram | telegram |
| Communities | communities | Reddit | reddit |
| Payment Methods to buy the node | payment-methods | BTC On Chain | btc-on-chain |
| Payment Methods to buy the node | payment-methods | BTC Lightning | btc-lightning |
| Payment Methods to buy the node | payment-methods | Alt Coins | alt-coins |
| Payment Methods to buy the node | payment-methods | Credit/Debit Card | credit-debit-card |
| Size & Materials | size-materials | Warranty | warranty |
| Size & Materials | size-materials | Weight | weight |
| Size & Materials | size-materials | Dimensions | dimensions |
| Hardware | hardware | CPU | cpu |
| Hardware | hardware | RAM | ram |
| Hardware | hardware | Storage | storage |
| Hardware | hardware | Ethernet | ethernet |
| Hardware | hardware | Wifi | wifi |
| Hardware | hardware | HDMI | hdmi |
| Hardware | hardware | USB | usb |
| Hardware | hardware | Bluetooth | bluetooth |
| Firmware | firmware | Firmware Name | firmware-name |
| Firmware | firmware | Latest Version | latest-version |
| Firmware | firmware | Latest Release Date | latest-release-date |
| Firmware | firmware | Release Notes | release-notes |
| Firmware | firmware | Source-available | source-available |
| Firmware | firmware | Open Source | open-source |
| Firmware | firmware | License | license |
| Firmware | firmware | Reproducible Builds | reproducible-builds |
| Platforms | platforms | Windows | windows |
| Platforms | platforms | MacOS | macos |
| Platforms | platforms | Linux | linux |
| Platforms | platforms | PC Disk Image | pc-disk-image |
| Platforms | platforms | Virtual Machine | virtual-machine |
| Platforms | platforms | Raspberry Pi 4 | raspberry-pi-4 |
| Platforms | platforms | Raspberry Pi 5 | raspberry-pi-5 |
| Platforms | platforms | Rock64 | rock-64 |
| Platforms | platforms | RockPro64 | rock-pro-64 |
| Platforms | platforms | RockPi 4 | rockpi-4 |
| Bitcoin Apps | bitcoin-apps | Bitcoin Node | bitcoin-node |
| Bitcoin Apps | bitcoin-apps | Lightning Node | lightning-node |
| Bitcoin Apps | bitcoin-apps | Block Explorer | block-explorer |
| Bitcoin Apps | bitcoin-apps | Mempool Visualizer | mempool-visualizer |
| Bitcoin Apps | bitcoin-apps | CoinJoin | coinjoin |
| Bitcoin Apps | bitcoin-apps | BTCPay Server | btcpay-server |
| Bitcoin Apps | bitcoin-apps | Electrum Server | electrum-server |
| Bitcoin Apps | bitcoin-apps | Samourai Server | samourai-server |
| Bitcoin Apps | bitcoin-apps | Specter Desktop | specter-desktop |
| Other Features | other-features | Official Marketplace | official-marketplace |
| Other Features | other-features | Thirdparty Marketplace | thirdparty-marketplace |
| Other Features | other-features | Backup / Restore | backup-restore |
| Other Features | other-features | Health Checks | health-checks |
| Other Features | other-features | SSL | ssl |
| Other Features | other-features | Tor | tor |

## Website

The [thebitcoinhole.com](https://thebitcoinhole.com/) website offers a Bitcoin Nodes Comparison using this database. This website is the most comprehensive resource for comparing the features of top Bitcoin Nodes.

## Sponsor this project
Sponsor this project to help us get the funding we need to continue working on it.

* [Donate with Bitcoin Lightning](https://getalby.com/p/thebitcoinhole) ⚡️ [thebitcoinhole@getalby.com](https://getalby.com/p/thebitcoinhole)
* [Donate with PayPal or a credit card using Ko-fi](https://ko-fi.com/thebitcoinhole)
* [Donate on Patreon](https://www.patreon.com/TheBitcoinHole)

## Follow us
* [Twitter](http://twitter.com/thebitcoinhole)
* [Nostr](https://snort.social/p/npub1mtd7s63xd85ykv09p7y8wvg754jpsfpplxknh5xr0pu938zf86fqygqxas)
* [Medium](https://blog.thebitcoinhole.com/)
* [GitHub](https://github.com/thebitcoinhole)

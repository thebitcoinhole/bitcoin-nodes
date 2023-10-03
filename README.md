# The Bitcoin Hole - Nodes

## Introduction


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

<p align="center">
  <a href="https://fingerprint.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/HEAD/resources/logo_light.svg" />
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/HEAD/resources/logo_dark.svg" />
      <img src="https://raw.githubusercontent.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/HEAD/resources/logo_dark.svg" alt="Fingerprint logo" width="312px" />
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/actions/workflows/build.yml">
    <img src="https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/actions/workflows/build.yml/badge.svg" alt="Build status">
  </a>
  <a href="https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/">
    <img src="https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/badges.svg" alt="coverage">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-server-api">
    <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-server-api.svg" alt="Current NPM version">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-server-api">
    <img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs-pro-server-api.svg" alt="Monthly downloads from NPM">
  </a>
  <a href="https://discord.gg/39EpE2neBg">
    <img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
  </a>
</p>

# FingerprintJS Server API Node.js SDK
Node.js wrapper for [FingerprintJS Server API](https://dev.fingerprint.com/docs/server-api)

## Usage

Install package using npm
``` sh
npm i @fingerprintjs/fingerprintjs-pro-server-api
```

Or install package using yarn
``` sh
yarn add @fingerprintjs/fingerprintjs-pro-server-api
```

### Usage of the Server API
```ts
import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api';

// Init client with the given region and the secret api_key
const client = new FingerprintJsServerApiClient({region: Region.Global, apiKey: "<api_key>"});

// Get visitor history
client.getVisitorHistory("<visitorId>").then(visitorHistory => {
    console.log(visitorHistory);
});

```

### Usage of the built-in webhook visit type
```ts
const visit = visitWebhookBody as unknown as VisitWebhook;
```

## API

#### `FingerprintJsServerApiClient({region: Region, apiKey: string})` constructor
Creates an instance of the client.
##### Usage
```js
const client = new FingerprintJsServerApiClient({region: Region.EU, apiKey: "<api_key>"});
```
##### Params
- `region: Region` - a region of the server, possible value `Region.EU` or `Region.Global`
- `apiKey: string` - secret API key from the [FingerprintJS dashboard](https://dashboard.fingerprint.com/)
- `fetch?: typeof fetch` - optional implementation of `fetch` function (defaults to `node-fetch`)
---

#### `client.getVisitorHistory(visitorId: string, filter?: VisitorHistoryFilter): Promise<VisitorsResponse>`
Gets history for the given visitor and given filter, returns a promise with visitor history response.
##### Usage
```js
client.getVisitorHistory("<visitorId>", filter)
  .then(visitorHistory => {
    console.log(visitorHistory);
  })
  .catch(error => {
    if (error.status === 403) {
      console.log(error.error);
    } else if (error.status === 429) {
      retryLater(error.retryAfter); // this function needs to be implemented on your side 
    }
  });
```
##### Params
- `visitorId: string` - identifier of the visitor
- `filter?: VisitorHistoryFilter` - visitor history filter, more info in [the API documentation](https://dev.fingerprint.com/docs/server-api#query-parameters)
##### Returns
- `Promise<VisitorsResponse>` - promise with visitor history response
---
#### `VisitorHistoryFilter`
Filter for querying API - see [query parameters](https://dev.fingerprint.com/docs/server-api#query-parameters).
##### Usage
```js
const filter = {
    request_id: "<request_id>",
    linked_id: "<linked_id>",
    limit: 5,
    before: "<timeStamp>"
};
```
##### Properties
- `request_id: string` - filter events by requestId
- `linked_id: string` - filter events by custom identifier
- `limit: number` - limit scanned results
- `before: number` - used to paginate results
---
#### Server `VisitorsResponse` response
Find more info in [the API documentation](https://dev.fingerprint.com/docs/server-api#response)
```json
{
  "visitorId": "Ibk1527CUFmcnjLwIs4A9",
  "visits": [
    {
      "requestId": "0KSh65EnVoB85JBmloQK",
      "incognito": true,
      "linkedId": "somelinkedId",
      "time": "2019-05-21T16:40:13Z",
      // timestamp of the event with millisecond precision
      "timestamp": 1582299576512,
      "url": "https://www.example.com/login",
      "ip": "61.127.217.15",
      "ipLocation": {
        "accuracyRadius": 10,
        "latitude": 49.982,
        "longitude": 36.2566,
        "postalCode": "61202",
        "timezone": "Europe/Dusseldorf",
        "city": {
          "name": "Dusseldorf"
        },
        "continent": {
          "code": "EU",
          "name": "Europe"
        },
        "country": {
          "code": "DE",
          "name": "Germany"
        },
        "subdivisions": [
          {
            "isoCode": "63",
            "name": "North Rhine-Westphalia"
          }
        ],
      },
      "browserDetails": {
        "browserName": "Chrome",
        "browserMajorVersion": "74",
        "browserFullVersion": "74.0.3729",
        "os": "Windows",
        "osVersion": "7",
        "device": "Other",
        "userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) ....",
      },
      "confidence": {
        "score": 0.97
      },
      "visitorFound": true,
      "firstSeenAt": {
        "global": "2022-03-16T11:26:45.362Z",
        "subscription": "2022-03-16T11:31:01.101Z"
      },
      "lastSeenAt": {
        "global": "2022-03-16T11:28:34.023Z",
        "subscription": null
      }
    }
  ],
  // optional, if more results are available for pagination.
  "lastTimestamp": 1582299576512
}
```

#### `client.getEvent(requestId: string): Promise<EventResponse>`
Get events with all the information from each activated product - Bot Detection and Identification.
##### Usage
```typescript
client.getEvent("<requestId>")
  .then(eventInfo => {
    console.log(eventInfo);
  })
  .catch(error => {
    if (error.status === 403 || error.status === 404) {
      console.log(error.code, error.message);
    }
  });
```
##### Params
- `requestId: string` - identifier of the event
##### Returns
- `Promise<EventResponse>` - promise with event response
---
#### Server `EventResponse` response
Find more info in the [API documentation](https://dev.fingerprint.com/docs/server-api#response-1).
```json
{
  "products": {
    "identification": {
      "data": {
        "visitorId": "Ibk1527CUFmcnjLwIs4A9",
        "requestId": "0KSh65EnVoB85JBmloQK",
        "incognito": true,
        "linkedId": "somelinkedId",
        "time": "2019-05-21T16:40:13Z",
        "timestamp": 1582299576512,
        "url": "https://www.example.com/login",
        "ip": "61.127.217.15",
        "ipLocation": {
          "accuracyRadius": 10,
          "latitude": 49.982,
          "longitude": 36.2566,
          "postalCode": "61202",
          "timezone": "Europe/Dusseldorf",
          "city": {
            "name": "Dusseldorf"
          },
          "continent": {
            "code": "EU",
            "name": "Europe"
          },
          "country": {
            "code": "DE",
            "name": "Germany"
          },
          "subdivisions": [
            {
              "isoCode": "63",
              "name": "North Rhine-Westphalia"
            }
          ],
        },
        "browserDetails": {
          "browserName": "Chrome",
          "browserMajorVersion": "74",
          "browserFullVersion": "74.0.3729",
          "os": "Windows",
          "osVersion": "7",
          "device": "Other",
          "userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) ....",
        },
        "confidence": {
           "score": 0.97
        },
        "visitorFound": true,
        "firstSeenAt": {
           "global": "2022-03-16T11:26:45.362Z",
           "subscription": "2022-03-16T11:31:01.101Z"
        },
        "lastSeenAt": {
          "global": "2022-03-16T11:28:34.023Z",
          "subscription": null
        }
      }
    },
    "botd": {
      "data": {
        "bot": {
          "result": "notDetected"
        },
        "url": "https://example.com/login",
        "ip": "61.127.217.15",
        "time": "2019-05-21T16:40:13Z"
      }
    }
  }
}
```
### Using with TypeScript

`getEvent` and `getVisitorHistory` methods return generic types `Promise<EventResponse>` and `Promise<VisitorsResponse>` and throw `EventError` and `VisitorsError`.

You can use typeguards to narrow error types as in example below.

```typescript
import { isVisitorsError, isEventError } from '@fingerprintjs/fingerprintjs-pro-server-api';

client
  .getVisitorHistory("<visitorId>", filter)
  .then(result => console.log(result))
  .catch(err => {
    if (isVisitorsError(err)) {
      if (err.code === 429) {
        // VisitorsError429 type
        retryLater(err.retryAfter); // this function needs to be implemented on your side 
      } else {
        console.log('error: ', err.error)
      }
    } else {
      console.log('unknown error: ', err)
    }
  });

client
  .getEvent("<requestId>")
  .then(result => console.log(result))
  .catch(err => {
    if (isEventError(err)) {
      console.log(`error ${err.code}: `, err.error.message)
    } else {
      console.log('unknown error: ', err)
    }
  });
```

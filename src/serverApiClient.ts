import fetch from 'node-fetch';
import querystring from 'querystring'
import { FingerprintJsServerApiConfig } from './serverApiConfig';
import { VisitorHistoryFilter, VisitorsResponse, Region } from './types';

export class FingerprintJsServerApiClient {
  private readonly euRegionUrl = "https://eu.api.fpjs.io/";
  private readonly globaRegionUrl = "https://api.fpjs.io/";

  private readonly clientConfig: FingerprintJsServerApiConfig;

  /**
  * FingerprintJS server api client used to fetch data from FingerprintJS
  * @constructor
  * @param {FingerprintJsServerApiConfig} config - The client configuration
  */
  constructor(config: FingerprintJsServerApiConfig) {
    if (!config) {
      throw new Error(`Config is not set`);
    }

    this.clientConfig = config;
  }

  /**
  * Gets hisory for the givem visitor
  * @param {string} visitorId - Identifier of the visitor
  * @param {VisitorHistoryFilter} filter - Visitor history filter
  */
  public async getVisitorHistory(visitorId: string, filter?: VisitorHistoryFilter): Promise<VisitorsResponse> {
    if (!visitorId) {
      throw Error(`VisitorId is not set`);
    }

    const serverApiUrl = this.getServerApiUrl(this.clientConfig.region);
    const serverApiPath = `${serverApiUrl}visitors/${visitorId}`;
    const queryString = filter ? querystring.stringify(filter) : '';
    const url = `${serverApiPath}?${queryString}`;

    return fetch(url, {
      method: 'GET',
      headers: { 'Auth-Token': this.clientConfig.apiToken },
    })
      .then((response) => {
        return response.json()
          .then(jsonData => {
            const visitorsResponse = jsonData as VisitorsResponse;
            return visitorsResponse;
          })
          .catch(err => {
            throw new Error(err.toString());
          })
      })
      .catch((err) => {
        throw new Error(err.toString());
      })
  }

  private getServerApiUrl(region: Region) {
    switch (region) {
      case Region.EU:
        return this.euRegionUrl;
      case Region.Global:
        return this.globaRegionUrl;
      default:
        throw new Error(`Unsupported region`);
    }
  }
}
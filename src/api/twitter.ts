import axios from 'axios';
import { wait } from '../utils';

export type TweetFilter = {
  limit: number,
  pageToken: string,
  text: string
  lastId: string
};

export type TwitterSearchResponse = {
  meta: TwitterSearchMeta,
  data: TwitterPost[]
};

export type TwitterSearchMeta = {
   newest_id: string,
   oldest_id: string,
   next_token: string,
   result_count: number
};

export type TwitterPost = {
  id: string
  text: string
};

const TIME_WINDOW = 15 * 60 * 1000;
const REQUESTS_PER_TIME_WINDOW = 420;

export class TwitterApi {
  key: string;
  secret: string;
  lastRequestWindowCycleTime: number;
  requestCountPerMinute: number;
  bearerToken: string;
  baseUrl: string;

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;
    this.lastRequestWindowCycleTime = 0;
    this.baseUrl = 'https://api.twitter.com';
  }

  async init() {
    await this.getBearerToken();
  }

  async waitForRateLimit() {
    const timeDiff = Date.now() - this.lastRequestWindowCycleTime;
    if (timeDiff > TIME_WINDOW) {
      this.requestCountPerMinute = 0;
      this.lastRequestWindowCycleTime = Date.now();
    }

    if (this.requestCountPerMinute >= REQUESTS_PER_TIME_WINDOW) {
      const coolDown = TIME_WINDOW - timeDiff;
      console.log(`[*] Waiting for cooldown ${Math.round(coolDown / 1000)} seconds to not hit rate limit`);
      await wait(coolDown);
      return this.waitForRateLimit();
    }

    this.requestCountPerMinute++;
  }

  async getBearerToken() : Promise<void> {
    const authHeader = Buffer.from(`${this.key}:${this.secret}`).toString('base64');
    const res = await axios(`${this.baseUrl}/oauth2/token`, {
      method: 'POST',
      data: 'grant_type=client_credentials',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    this.bearerToken = res.data.access_token;
  }

  // check rate limit, may use observables
  async getTweets({ limit = 100, pageToken, text, lastId } : TweetFilter) : Promise<TwitterSearchResponse> {
    await this.waitForRateLimit();
    const res = await axios.get(`${this.baseUrl}/2/tweets/search/recent`, {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`
      },
      params: {
        max_results: limit,
        query: `${text} -is:retweet -is:reply`,
        sort_order: 'recency',
        ...(pageToken && { next_token: pageToken }),
        ...(lastId && { since_id: lastId })
      }
    });

    return res.data;
  }
}

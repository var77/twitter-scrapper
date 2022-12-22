import { Topic, TopicDocument } from '../db/models/topic';
import { Tweet } from '../db/models/tweet';
import { TwitterApi } from '../api/twitter';

export const startJob = (twitterApi: TwitterApi, pollInterval: number) => {
  startScrapper(twitterApi);
  setInterval(async () => {
    startScrapper(twitterApi);
  }, pollInterval);
};

export const startScrapper = async (twitterApi: TwitterApi) => {
    const topics = await Topic.find();
    console.log(`Topics are: ${topics.map(t => t.name).join(',')}`);

    await Promise.all(topics.map(async topic => {
      await scrape(twitterApi, topic);
    }));
};

const scrape = async (twitterApi: TwitterApi, topic: TopicDocument, nextToken?: string) => {
    console.log(`[*] Scrapping Topic ${topic.name} with pageToken ${nextToken || 'None'} [*]`);
    const tweetsResponse = await twitterApi.getTweets({ limit: 100, lastId: topic.lastId, text: topic.name, pageToken: nextToken });
    if (!tweetsResponse.data) return;
    const lastTweetId = tweetsResponse.meta.newest_id;
    console.log(`[*] Updating last id for topic ${topic.name} to ${lastTweetId} [*]`);
    
    await Topic.updateOne({ _id: topic._id }, { lastId: lastTweetId });
    await Tweet.insertMany(tweetsResponse.data.map(tweet => ({ id: tweet.id, text: tweet.text, topic: topic.name })));

    if (tweetsResponse.meta.next_token) {
      return scrape(twitterApi, topic, tweetsResponse.meta.next_token);
    }

};

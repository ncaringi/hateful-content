const { TwitterApi } = require("twitter-api-v2");
const axios = require('axios');
const fs = require('fs');

const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET,
});

const bearer = new TwitterApi(process.env.BEARER_TOKEN);

const twitterClient = client.readOnly;
const twitterBearer = bearer.readOnly;

const tweetRetrieval = async (query, max_results = 10) => {
  try {
    const tweetRetrieved = await twitterClient.v2.search(query, {
      'media.fields': 'url',
      'expansions': [
        'in_reply_to_user_id',
        'referenced_tweets.id',
        'entities.mentions.username'
      ],
      'tweet.fields': [
        'text',
        'conversation_id',
        'reply_settings',
        'id',
        'in_reply_to_user_id',
        'public_metrics',
        'possibly_sensitive',
        'referenced_tweets'
      ],
      'max_results': max_results,
    });
    console.log('Tweets récupérés :', tweetRetrieved);
    fs.writeFileSync(`./tweet3/fullTweet.json`, JSON.stringify(tweetRetrieved));
    for (tweet in tweetRetrieved._realData.data) {
      fs.writeFileSync(`./tweet3/tweet${tweet}.json`, JSON.stringify(tweetRetrieved._realData.data[tweet]));
    }
    console.log('Files written!');
    for (erreur in tweetRetrieved._realData.errors) {
      console.log('Error :', tweetRetrieved._realData.errors[erreur])
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des tweets :', error);
  }
};

module.exports = { tweetRetrieval };
const dotenv = require('dotenv');
dotenv.config();
const { tweetRetrieval } = require("./twitter.js");
const { lexiconsRetrieval } = require("./weaponizedword.js");
const fs = require('fs');

const query = "lang:fr (context:131.1483822657963397121) -is:retweet (is:quote OR is:reply)"
const numberOfResult = 10

//tweetRetrieval(query, numberOfResult);

//lexiconsRetrieval();

const lexiconsFiles = [
   'lexicon_getDerogatory.json',
   'lexicon_getDiscriminatory.json',
   'lexicon_getThreatening.json',
   'lexicon_getWatchwords.json'
];

const keysToCheck = [
   "is_about_nationality",
   "is_about_ethnicity",
   "is_about_religion",
   "is_about_gender",
   "is_about_orientation",
   "is_about_disability",
   "is_about_class",
   "is_archaic"
];

const tweetAnalysis = (tweet) => {
   const results = []

   for (const element of lexiconsFiles) {
      const lexicon = (JSON.parse(fs.readFileSync(`./lexicons/${element}`, 'utf-8')))

      lexicon.forEach(word => {
         const offensiveWord = ' ' + word.term.toLowerCase() + ' ';
         tweet = ' ' + tweet.toLowerCase() + ' ';
         if (tweet.includes(offensiveWord)) {
            const result = {
               tweet: tweet,
               term: word.term,
               lexicon: element
                           .replace('lexicon_get', '')
                           .replace('.json', ''),
               offensiveness: word.offensiveness,
               about: []
            }
            keysToCheck.forEach(key => {
               if (word[key] === "Y") {
                  result.about.push(key);
               }
            })
            results.push(result);
         }
      });
   }
   console.log('Résultats :', results)
   return results;
};
const tweets = JSON.parse(fs.readFileSync('./tweet3/fullTweet.json', 'utf-8'));
for (const retrievedTweet of tweets._realData.data) {
   tweetAnalysis(retrievedTweet.text);
}
for (const referencedTweet of tweets._realData.includes.tweets) {
   tweetAnalysis(referencedTweet.text);
}
console.log(tweets._realData.includes.tweets.length)
console.log(tweets._realData.data.length)
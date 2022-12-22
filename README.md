## Setup
- Fill the `.env` values
- Run yarn
- Run yarn start:dev

It should first seed the database using `seedDatabase` function and then start scrapping the topics.
Then you can see scrapped tweets in database under `tweets` collection.


## TODO
- Write tests
- Listen for SIGTERM and gracefully close the application so it won't end when the job is being run 
- Make Rate limit throttler more clever, for now it will burst the requests as much as possible for time window and then wait the whole time window. In optimal way it should just slow down the requests based on concurrency and time window + rpm
- Limit the topic scrapping concurrency, currently it is being run in `Promise.all` it should be limited to an optimal number for concurrency based on system
- Keep track of requests in some store like Redis, so when restarting the application rate limit values won't be reseted and it won't hit the rate limit
- Check the job polling to not collide with already running job. This can be the case when on first startup it will take some time to poll all the tweets and the next cycle will be run colliding the job.
- Get more fields from twitter API like images, author, etc...
- Setup conventional commits, pre-commit hooks, etc..

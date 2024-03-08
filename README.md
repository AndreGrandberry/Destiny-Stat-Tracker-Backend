This is the Stat Tracker for the video game Destiny 2. Built using a combination of NodeJS and React. This is the backend. All of the 

data used for this project was pulled from the Bungie API: https://bungie-net.github.io. Due to technical limiations various 

workarounds to build the app. This unfortunately results in a long initial load time. RedisStore was used as a backup for sessions

in the event that the browser sessions or local storage were not working properly. Ngrok was used to generate https urls. A

secure connection is required when using a redirect URI with Bungie. The flow of the application goes as follows: The user goes to the 

homepage and clicks the login. A request is sent to Bungie for an authorization code, the user is redirect to Bungie's OAuthentication

page to authorize the app to use their Bungie.net data. Upon authorization a post request is made to Bungie's token endpoint and the 

authorization code is exchanged for an access Token. This is done in the /auth/callback route. Also in this route the access token is 

used to fetch important information needed to make authorized API requests. Afterwards, the app makes the API calls to get the metric

loads it up into a sql database, then upon being redirected to the dashboard, it is pulled and used on the webpage.
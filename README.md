# kickstarter-rewards-tool
A very simple tool to analyse rewards tiers on Kickstarter. Split into a node.js based scraper to collect data from projects and and a d3.js interface analyse the data. In particular this illuminates the relationship between the amount of money earned per reward, and how many people backed that particular reward.


##Usage
###Client:
`index.html` is a simple d3.js front end to inspect data stored in data.json. Run index.html from any kind of webserver (local or hosted) in order to play with data. 

###Scraper
To collect your own data, you can run scraper.js from node.
`node scraper.js`

To select which projects you want included, add the kickstarter urls to the array of srcs inside scraper. Note this might need some updates as the project was originally created in Sept 2013 and Kickstarter may have changed thier webpage since then.

##Disclaimer()
This tool was created as a fun hack project to test out d3.js to aid our research for [Made With Monster Love's](http://www.madewithmonsterlove.com/) own [Kickstarter](https://www.kickstarter.com/projects/947738574/cadence
) campaign for the music puzzle game [Cadence](http://www.playcadence.com). Because we're video game developers who need to focus on building a game, we have no intention of maintaining this tool. You are of course welcome to make any improvements and we'll gladly accept pull requests. 



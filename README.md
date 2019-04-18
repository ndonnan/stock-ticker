
# Stock Ticker
[![CircleCI](https://circleci.com/gh/NealDonnan/stock-ticker.svg?style=svg)](https://circleci.com/gh/NealDonnan/stock-ticker)

This is a Node.js REST application to retrieve stock quotes.

This currently supports US based stocks.

## Development
To run the application locally:
```
npm install
npm start
``` 
Run the following curl command to get a quote:
```
curl http://localhost:3000/quote?symbol=AAPL
```
To test the application run:
```
npm test
```
This will use standard for linting and display a coverage report in the console and also generate an html coverage report in the 'coverage' directory. The tests require 100% code coverage to pass.

## Docker
To build a docker image locally use the following npm script:
```
npm run docker:build
```
The following npm script can be used to create and run a docker container named stock-ticker:
```
npm run docker:run
```
This will map the local port 3001 to the docker container so a quote can be obtained by using:
```
curl http://localhost:3001/quote?symbol=AAPL
```
To stop and remove the docker container run:
```
npm run docker:stop
```

## Swagger
The API is documented using Swagger.
On the local running server navigate to:

http://localhost:3000/documentation

or for the docker container navigate to:

http://localhost:3001/documentation

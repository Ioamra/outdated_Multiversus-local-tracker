<h1 align="center">
	MultiVersus local tracker
</h1>

## About

A local tracker for MultiVersus using [multiversus.js](https://github.com/ElijahPepe/multiversus.js), a node.js module to access the MultiVersus API.
With this app you can see account stats, match history, 1v1 2v2 leaderboard global and for each character and some graphs.

## Installation

- Download the project
- Install [node.js](https://nodejs.org/en/)
- Edit userInfo.js with your Steam username and password (working only for account who doesn't have Steam Guard)
```js
const username = 'SteamUserName';
const password = 'SteamPassword';
```
- Create a cmd file to start the app (to create it, create a txt file, edit it and change txt to cmd)
```txt
cd C:\Users\...\your folder path\...\Multiversus-Tracker\
node .
```

## How use

- Run the cmd file to start the app
- Go to http://localhost:3000/ on your browser
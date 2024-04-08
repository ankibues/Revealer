# Revealer

Revealer is an educational game that provides user with a hidden picture associated with a weekly theme each day, and the user has to guess what the picture is, by removing as little tiles as possible.

The lowest score wins!

You can play it [here](https://play-revealer.com/)! 

## Technology Used

Revealer is currently built on MERN (MongoDb, Express, React, Nodejs) Stack.


## Project Structure

Revealer follows a monolith type code architecture with React Front end, and a Express Backend, along with MongoDB database. The React Front end code is in root directory, while the backend server code is in the server folder in root directory. 


## Installation and Setup

A demo version of Revealer is currently hosted here: https://play-revealer.com/

### Developers:

#### Start the backend server 

1. Go to revealer/server folder
`cd revealer/server`

2. Install dependencies
`npm install`

3. Start the node.js server

`node app.js`

#### Run Front-End Locally

1. Clone the repository: 
`git clone https://github.com/ankibues/Revealer.git`

2. Install Dependencies

`cd revealer`
`npm install`

3. Start the development server:
`npm run start`
4. Open your browser and navigate to http://localhost:3000

#### Note: Update following environment variables in .env file unique to your case
For Front-end code:   
> REACT_APP_URL

For backend code:  
> MONGO_URI  
> UNSPLASH_ACCESS_KEY  
> PORT  
> FRONTEND_URL  

#### Image handling system

As of April 8th, the images used in the game are being uploaded via unSplash API. 

The link to the unSplash images are stored in MongoDB database. The Image Handling system comprise of certain scripts that can add new images and themes for the game.

For further instructions, Please refer to this [document](ImageHandlingSystem.md)


## How to Play

Click on the tiles to reveal a portion of the hidden picture

Your goal is to guess the picture in as less clicks as possible

A new picture is released daily at midnight

Each picture belongs to a weekly theme.


## How to Contribute

More information to be added soon! Please contact Ankit at ankbhand@gmail.com


## Contact Information

Email me at ankbhand2@gmail.com


## Project Status

In development

## Future work:

> Dark vs Light mode implementation   
> AI assistant based hint system  
> Leaderboard capability  

## Donation:

If you find this project useful or enjoyed the game, please consider supporting its development by donating [here](https://ko-fi.com/bhandlab).


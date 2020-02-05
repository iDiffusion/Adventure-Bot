# AdventureBot

A twitch bot with permissions, modules, access control, and many more features.

## Setup

This bot requires a folder that isn't present, `node_modules`. The `node_modules` can be obtained after downloading [nodejs](https://nodejs.org/en/) and then running the commands [tmi.js](https://docs.tmijs.org/) in a command line of your choice. The `config.json` file also needs to be modified before running this bot; the name, channels, and oauth variables inside that file need to be edited before being run.

## Installation instructions (easy way)

Keep in mind that this process requires you to have [Git](https://git-scm.com/).

In a command line of your choice, enter the following commands:

-   `git clone https://github.com/iDiffusion/Adventure-Bot/` to download the project
-   `cd Adventure-Bot` to open the new project directory made by GitHub
-   `npm install tmi.js --save` to install its dependencies
-   `npm install pm2 -g` to install pm2, if you would like to run bot in the background.

Make sure to edit the `config.json` file before running the bot, it will not work unedited.

## Installation instructions (hard way)

Keep in mind that this process requires `nodejs` and `tmijs` to be installed.

-   Navigate to the [Repository](https://github.com/iDiffusion/Adventure-Bot), if not already there.
-   Click `Clone or download` then `Download ZIP`.
-   Extract and open the folder.
-   Within the folder press and hold `shift` and `right-click` to open the options, then click `Open CommandPrompt window here`.
-   Type `npm install tmi.js --save` to install the bots dependencies.
-   Type `npm install pm2 -g` to install pm2, if you would like to run bot in the background.

## Usage

Before running the bot make sure that `config.js` has been setup properly, [nodejs](https://nodejs.org/en/) has been downloaded and installed, and [tmi.js](https://docs.tmijs.org/) has been installed in the folder with the bot code. Also the bot must be modded, which will allow for fast responses and ensure the bot does not get timed out for messaging to fast (specifically when modifying players points, aka key-fragments).

-   To run `start.bat` click the executable file.
-   To run `startPM2.bat` make sure that [pm2](http://pm2.keymetrics.io/) is installed and then click the executable file.
-   To initiate the adventure, type `!adventure` in twitch chat.
-   To start the adventure, type `!explore f` in twitch chat.
-   If you would like to see the current status type `!status` then look at the CommandPrompt

## Prompt.json file

The `prompt.json` file is formatted to make altering the story a breeze.

First, there are two variables within the file; one called `totems` which contain an array of totems and `story` which contain an array of elements (parts of the story). The first few elements in the story are `adventure` and `explore`, followed by the story.

Each element in story contains a `path` (path name), `value` (string to printed), `connected` (list of the next linked paths/choices), `userPick` (whether or not to stop and allow users to vote), `runnable` (which function to run when the path in called, i.e. giveKeys), and `required` (the name of the totem required if needed). For example:
```
  {
    "path": "1",
    "value": "You have been lead to a fork in the road, do you take the !left or !right path?",
    "connected": ["left", "right"],
    "userPick": true,
    "runnable": null,
    "required": null
  }

```

Each element in totems contains a `path` (name of the totem), and `value` (which is whispered to them when the variable, testing is enabled):
```
  {
    "path": "butterknife",
    "value": "You have chosen to carry the Butter Knife"
  },
  {
    "path": "locket",
    "value": "You have chosen to carry the Locket"
  },
  {
    "path": "book",
    "value": "You have chosen to carry the Book"
  }
````

The bot will work with an unfinished story but will not continue if it takes a path that is unfinished. If you have any questions, please feel free to ask.

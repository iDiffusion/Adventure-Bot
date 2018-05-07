# AdventureBot

A twitch bot with permissions, modules, access control, and many more features.

## Setup

This bot requires a folder that isn't present, `node_modules`. The `node_modules` can be obtained after downloading [nodejs](https://nodejs.org/en/) and then running the following command [tmi.js](https://docs.tmijs.org/) in a command line of your choice. The `config.json` file also needs to be modified before running this bot; the name, channels and oauth variables inside that file needs to be edited before being run.

## Installation instructions (easy way)

Keep in mind that this process requires you to have [Git](https://git-scm.com/).

In a command line of your choice, enter the following commands:

-   `git clone https://github.com/iDiffusion/Adventure-Bot/` to download the project
-   `cd Adventure-Bot` to open the new project directory made by GitHub
-   `npm install tmi.js --save` to install its dependencies
-   `npm install pm2 -g` to install pm2, if you would like to run bot in the background.

Make sure to edit the `config.json` file before running the bot, it will not work unedited.

## Installation instructions (hard way)

Keep in mind that this process still requires `nodejs` and `tmijs` to be installed.

-   Navigate to the [Repository](https://github.com/iDiffusion/Adventure-Bot), if not already there.
-   Click `Clone or download` then `Download ZIP`.
-   Extract and open the folder.
-   Within the folder press and hold `shift` and `right-click` to open the options, then click `Open CommandPrompt window here`.
-   Type `npm install tmi.js --save` to install the bots dependencies.
-   Type `npm install pm2 -g` to install pm2, if you would like to run bot in the background.

## Usage

Before running the bot make sure that `config.js` has been setup properly, [nodejs](https://nodejs.org/en/) has been downloaded and installed, and [tmi.js](https://docs.tmijs.org/) also been installed in the folder with the bot code.

-   To run `start.bat` click the executable file.
-   To run `startPM2.bad` make sure that [pm2](http://pm2.keymetrics.io/) is installed then click the executable file.

## Prompt.json file

The `prompt.json` file is formatted to make changing or adding to the story a breeze.

First there is one variable within the file called story which contains an array of elements (parts of the story).

The first few elements are `adventure`, `explore`, and the totems (currently book, knife, and locket); then it is followed by the story.

Each element in story contains a `path` (path name), `value` (string to printed), `connected` (list of the next linked paths/choices), `userPick` (whether or not to stop and allow users to vote), `runnable` (which function to run when the path in called, ie giveKeys), and `required` (the name of the totem required if one is needed). For example:
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

The only one that looks different is `explore` which contains an array of totems labeled `totems`:
```
  {
   "path": "explore",
   "value": "On the path before you lies a !Locket, !Book, and !ButterKnife; which one do you carry with you on your journey, $user?",
   "totems": ["book", "locket", "butterknife"],
   "connected": ["1", "2", "3", "4"],
   "userPick": false,
   "runnable": null,
   "required": null
  }
```

And each totem:
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

If you have any questions please feel free to ask.

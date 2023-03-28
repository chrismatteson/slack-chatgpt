## Slack ChatGPT SlackBot built with Spin

This repo provides an example bot that can be used to connect Slack with ChatGPT.

#Steps
1) Install Spin from here: https://github.com/fermyon/spin/releases/
2) Install "js2wasm" plugin with `spin plugin install js2wasm`
3) Ensure NPM is installed with `npm --version` or install from here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
4) Clone this repo and cd into the directory `git clone https://github.com/chrismatteson/slack-chatgpt && cd slack-chatgpt`
5) Run `npm install`
6) Run `spin build`
7) Create an openai api key here: https://platform.openai.com/account/api-keys
8) Create a slack app as part of our slack org here: https://api.slack.com/apps/ . Note the Verification token for this app.
9) Create a Fermyon Cloud account if you don't already have one: https://cloud.fermyon.com
10) Run `spin login` from terminal and authenticate
11) Run `spin deploy --key-value openai_key=<your openai_key> --key-value slack_token=<your slack token>
12) Copy URL returned. From slack app configuration page choose "Slash Commands" under Features. Create a New Command:
    * Command: /chatgpt
    * Request URL: <URL of app returned in deploy command>
    * Short Description: A Slackbot to query ChatGPT
    * Usage Hint: [question]
13) Test out your app in slack with /chatgpt <your question>
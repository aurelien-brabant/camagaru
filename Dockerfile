FROM        node:16-bullseye

WORKDIR     /usr/app

COPY        . .

RUN         yarn global add postcss-cli && yarn install && yarn build && rm -rf ./node_modules && yarn global remove postcss-cli

RUN         yarn install --production

ENTRYPOINT  [ "yarn", "start" ]

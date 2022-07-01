FROM        node:16-bullseye

WORKDIR     /usr/app

COPY        . .

RUN         yarn install && yarn build && rm -rf ./node_modules

RUN         yarn install --production

ENTRYPOINT [ "yarn", "start" ]

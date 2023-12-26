FROM docker.io/library/node:20.10-bullseye-slim as development

WORKDIR /home/app

ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN npm install --include=prod --include=dev

COPY ./ ./

CMD npm run start:dev

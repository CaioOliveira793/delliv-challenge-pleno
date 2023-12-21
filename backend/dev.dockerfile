FROM docker.io/library/node:20.10-bullseye-slim as development

WORKDIR /home/node

ENV NODE_ENV=development

COPY ./ ./

RUN npm install --include=prod --include=dev

CMD npm run start:dev

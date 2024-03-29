FROM docker.io/library/node:20.10-bullseye-slim as development

WORKDIR /home/node

ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN npm install --include=prod --include=dev

COPY ./ ./

CMD npm run db:migrate && npm run start:dev

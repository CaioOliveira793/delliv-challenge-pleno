FROM docker.io/library/httpd:2.4.58-bookworm as build

WORKDIR /home/app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm install --include=prod --include=dev

COPY ./ ./

CMD npm run build

FROM docker.io/library/httpd:2.4.58-bookworm as production

COPY --from=build /home/app/dist /usr/local/apache2/htdocs

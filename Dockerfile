FROM node:lts as base
WORKDIR /app

RUN git clone https://github.com/vishnubob/wait-for-it.git

COPY package.json yarn.lock ./
RUN yarn install
COPY ./prisma ./prisma
RUN npx prisma generate
COPY ./ ./

FROM base as development
CMD [ "yarn","start:dev" ]

FROM base as test
CMD [ "yarn","test" ]

FROM base as production
RUN yarn build 
CMD ["yarn", "start" ]

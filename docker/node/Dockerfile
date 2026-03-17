###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:14 As development

USER node

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

RUN npm ci

RUN ls -la

CMD ["npm", "run", "serve"]

###################
# BUILD FOR PRODUCTION
###################

FROM node:14 As build

USER node

WORKDIR /home/node/app

COPY package*.json ./

COPY --from=development /home/node/app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force
FROM node:10-alpine
COPY src ./src
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./
COPY ngsw-config.json ./
COPY browserslist ./
RUN npm install
COPY . .
RUN npm run build:prod
ENTRYPOINT ["npm", "run", "start:prod"]

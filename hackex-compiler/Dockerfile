FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add --no-cache g++ gcc make python3 openjdk11 && apk add --no-cache bash
COPY package.json .
COPY . .
RUN npm install
EXPOSE 8000
CMD ["node", "app.js"]
EXPOSE 8000
# docker container run -d -p 8000:8000 --name hackex-compiler hackex-compiler
# docker image build -t hackex-compiler .
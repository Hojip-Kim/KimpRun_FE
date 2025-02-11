FROM node:20-alpine

WORKDIR /app

# package.json, lock 파일 복사
COPY package.json package-lock.json ./
RUN npm install

# source 전체 복사
COPY . .

# next.js build (next build - default production build)
RUN npm run build

EXPOSE 3000

# next.js server run
CMD ["npm", "start"]
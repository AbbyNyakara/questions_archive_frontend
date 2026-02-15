# Stage 1: Build Vite app with Yarn 3
FROM node:22-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn config set nodeLinker node-modules
RUN yarn install --immutable

COPY . .
RUN yarn build   

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

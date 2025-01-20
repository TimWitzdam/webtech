FROM node:lts-alpine as builder
WORKDIR /app
COPY package.json ./
RUN rm -rf node_modules && npm i
COPY . .
RUN npm run build

FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

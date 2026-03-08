FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
RUN mkdir -p /etc/nginx/ssl
COPY --from=build /app/dist/joyeria-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl/localhost+1.pem /etc/nginx/ssl/localhost+1.pem
COPY ssl/localhost+1-key.pem /etc/nginx/ssl/localhost+1-key.pem
RUN chmod -R 755 /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
EXPOSE 80 443
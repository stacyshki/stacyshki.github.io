# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine
COPY . /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

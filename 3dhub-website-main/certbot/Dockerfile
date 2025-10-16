FROM certbot/certbot:latest
WORKDIR /usr/src/app

RUN apk add docker-compose
COPY . .

RUN chmod +x /usr/src/app/certbot.sh
ENTRYPOINT ["sh", "certbot.sh"]
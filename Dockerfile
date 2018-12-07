FROM nginx:1.15-alpine

LABEL maintainer="Sangram Reddy <reddy.horcrux@gmail.com>"
LABEL application="dg-ui"

RUN mkdir /home/app && \
    rm -v /etc/nginx/nginx.conf

COPY ./nginx.conf /etc/nginx/

RUN echo "daemon off;" >> /etc/nginx/nginx.conf && \
    rm -v /usr/share/nginx/html/index.html

COPY ./dist /usr/share/nginx/html/
COPY ./secrets/dataglitter.co.uk.crt /etc/pki/nginx/server.crt
COPY ./secrets/server.key /etc/pki/nginx/private/server.key
COPY ./secrets/8A76ABC725E66AC77377356C11D81932.txt /usr/share/nginx/html/.well-known/pki-validation/

RUN chmod -R 755 /usr/share/nginx/html/static

WORKDIR /home/app/

EXPOSE 80 443

CMD [ "/usr/sbin/nginx" ]

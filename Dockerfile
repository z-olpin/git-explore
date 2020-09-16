FROM alpine:3.12

## Do not use, use Dockerfile_debug for now.

#install nodejs then download and extract tokei
RUN apk add npm nodejs \ 
&& wget -O tokei.tar.gz "https://github.com/XAMPPRocky/tokei/releases/download/v12.0.4/tokei-x86_64-unknown-linux-musl.tar.gz" \
&& tar -xzf tokei.tar.gz \
&& rm tokei.tar.gz \ 
&& mv ./tokei /bin/

WORKDIR /data

COPY code .


EXPOSE 3000
CMD [ "npm", "start"]



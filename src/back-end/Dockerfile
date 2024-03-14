FROM python:3.8

RUN mkdir /app

COPY ./back-end /app/back-end
WORKDIR /app/back-end

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

RUN  pip install --upgrade pip \
	&& pip install -r requirements.txt
FROM python:3.8.5 AS dev

RUN apt-get update && apt-get install -y \
    postgresql

# set environment variables
ENV PYTHONUNBUFFERED 1

# create app dir and set as workdir
RUN mkdir -p /app /pip-requirements
WORKDIR /app

# install requirements
RUN pip install --upgrade pip
COPY ./pip-requirements /pip-requirements/
ARG PIP_REQ
RUN pip install -r /pip-requirements/$PIP_REQ.txt


FROM dev

COPY ./src ./entry.sh /app/
RUN chmod 744 ./entry.sh
ENTRYPOINT ["./entry.sh"]

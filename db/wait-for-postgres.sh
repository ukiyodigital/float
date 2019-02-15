#!/bin/bash

until pg_isready -h "db" -U "testuser"; do
  sleep 2
done

exec ${@}


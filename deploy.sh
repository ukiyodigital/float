#!/bin/sh

ssh -tt -o StrictHostKeyChecking=no ec2-user@$EC2_PUBLIC_IP_ADDRESS << 'ENDSSH'
  cd /home/ec2-user/app
  export $(cat .env)
  rm .env
  docker login -u $DOCKER_USERNAME -p $DOCKER_TOKEN
  docker pull floatcms:api
  docker pull floatcms:nginx
  docker-compose -f docker-compose.prod.yml up -d
ENDSSH

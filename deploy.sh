#!/bin/sh

ssh -o StrictHostKeyChecking=no ec2-user@$EC2_PUBLIC_IP_ADDRESS << 'ENDSSH'
  cd /home/ec2-user/app
  export $(cat .env)
  rm .env
  chmod +x ./init-letsencrypt.sh
  sudo ./init-letsencrypt.sh
  echo $DOCKER_TOKEN | docker login -u $DOCKER_USERNAME --password-stdin
  docker system prune -f
  docker pull floatcms/api
  docker pull floatcms/nginx
  docker-compose -f docker-compose.prod.yml up -d
ENDSSH

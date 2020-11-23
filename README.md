# Float: The Content Management System No One Asked For [![Build Status](https://cloud.drone.io/api/badges/ukiyodigital/float/status.svg?ref=refs/heads/develop)](https://cloud.drone.io/ukiyodigital/float)

## Setup

1. `git clone` and `cd` into the repository
1. run `docker-compose up` to build the image
1. any source code changes changes will be reflected in the docker containers...
1. access ui on `localhost:8000`
1. access api on `localhost:3000`
1. happy editing!

## Fixutres

Recreating Fixture Data:

```
python manage.py dumpdata  > apps/float/data/fixtures.json --indent 4 --exclude=auth --exclude=contenttypes --exclude silk
python manage.py loaddata  apps/float/data/fixtures.json
```

## Contributing

- work on 1 ticket per branch
- [Rebase your branch before merging](https://www.atlassian.com/git/articles/git-team-workflows-merge-or-rebase#:~:text=You%20have%20not%20shared%20your,code%20is%20ready%20for%20review.)

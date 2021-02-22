# Building Up Server

### Getting Started

Copy `.env.local` into a new file `.env`

Ensure docker is installed and the docker daemon is running

Ensure docker-compose is installed globally

At the root of the repo, run:

```
docker-compose up
```

If it's your first time running the project, you can set up the DB like so:

- `docker ps` and find the container ID for the building up server
- `docker exec <container_id> /bin/bash`
- `cd src`
- `sequelize db:seed:all`

If you'd like to explore the DB with `psql`, here's how:

- `docker ps` and find the container ID for the postgres instance
- `docker exec <container_id> /bin/bash`
- `psql postgresql://alfm:buildingup@localhost:5432/building_up_dev`

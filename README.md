## Run development environment

### Database

```
docker run \
    --rm \
    --name database \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=12345 \
    -v $(pwd)/Base:/docker-entrypoint-initdb.d \
    -p 5432:5432 \
    postgres
```

### Backend

Backend compilation takes a lot of time and uses a lot of storage so it is recommended to compile locally for development purposes.

### Pgadmin

```
docker run \
    --rm \
    --name pgadmin \
    -e PGADMIN_DEFAULT_EMAIL=some@email.com \
    -e PGADMIN_DEFAULT_PASSWORD=12345 \
    -e PGADMIN_CONFIG_SERVER_MODE=False \
    --net host \
    dpage/pgadmin4
```

### Frontend

```
docker run \
    --rm \
    --name front \
    -w /front \
    -v $(pwd)/Front:/front \
    --net host \
    alexsuch/angular-cli
```

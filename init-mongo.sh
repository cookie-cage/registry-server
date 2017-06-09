# docker-compose up -d
docker exec -it registryserver_mongo_1 mongo 127.0.0.1:27017/jsonresume --eval "db.resumes.insert({})"

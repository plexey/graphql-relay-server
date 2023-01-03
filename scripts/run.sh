sudo docker run -d \
  --name booky \
  -p 5432:5432 \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=booky \
  postgres
docker volume rm wms_backend_node_modules

docker compose exec backend npx tsx prisma/seed.ts

docker compose exec postgres psql -U wms -d wms
\dt
\d users
\q
#!/bin/bash
set -e

echo "🔄 Pulling production environment variables..."
vercel env pull .env.production --yes

echo "🗄️  Running Prisma migrations..."
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma migrate deploy

echo "✅ Migrations completed successfully!"
echo ""
echo "Verifying tables..."
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma db execute --stdin <<SQL
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
SQL

echo ""
echo "🎉 Production database is up to date!"

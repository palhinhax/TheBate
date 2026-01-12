# PgBouncer / Connection Pooler Configuration

## Issue: "cached plan must not change result type"

This error occurs when using connection poolers (like Neon's PgBouncer) after schema changes.

### Why It Happens

1. Connection poolers cache prepared SQL statements for performance
2. When you add/remove database columns (e.g., adding `imageUrl` to `Topic`)
3. The cached queries expect the old schema structure
4. PostgreSQL throws error: `ERROR: cached plan must not change result type`

### Solution

#### 1. Add `pgbouncer=true` to DATABASE_URL

```bash
# Before
DATABASE_URL="postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require"

# After
DATABASE_URL="postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require&pgbouncer=true"
```

This tells Prisma to:

- Disable prepared statement caching
- Use simple query protocol instead
- Avoid caching issues with pooled connections

#### 2. Clear Cached Plans (Emergency Fix)

If you're already experiencing the error:

```bash
# Option 1: Clear all cached plans
pnpm prisma db execute --stdin <<< "DISCARD ALL;"

# Option 2: Restart your application
# This forces new connections to be established
```

#### 3. For Production Deployments

After schema migrations in production:

```bash
# 1. Run migrations
pnpm prisma migrate deploy

# 2. Clear connection pool cache
pnpm prisma db execute --stdin <<< "DISCARD ALL;"

# 3. Restart your application (Vercel auto-redeploys)
```

### When to Use PgBouncer Mode

✅ **Always use** `pgbouncer=true` when:

- Using Neon's pooled connection (`-pooler` in hostname)
- Using any PgBouncer connection pooler
- Using Supabase's connection pooler
- Connection string uses transaction pooling

❌ **Don't use** `pgbouncer=true` when:

- Using direct database connection (no pooler)
- Using session pooling mode

### Configuration in This Project

1. **Environment Variables** (`.env`)
   - `DATABASE_URL` includes `&pgbouncer=true`

2. **Prisma Client** (`lib/prisma.ts`)
   - Configured to handle connection pooling
   - Comments explain the setup

### Neon-Specific Notes

Neon provides two connection strings:

- **Pooled** (recommended): `ep-xxx-pooler.neon.tech` - Use `pgbouncer=true`
- **Direct**: `ep-xxx.neon.tech` - Don't use `pgbouncer=true`

For production, always use the pooled connection for better performance.

### Troubleshooting

If you still see the error:

1. **Verify connection string** has `&pgbouncer=true`
2. **Restart the application** to establish new connections
3. **Check Neon Dashboard** - ensure migrations were applied
4. **Run DISCARD ALL** to clear server-side cache
5. **Wait 5-10 minutes** - connection pools eventually cycle

### References

- [Prisma PgBouncer Guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer)
- [Neon Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [PostgreSQL Prepared Statements](https://www.postgresql.org/docs/current/sql-prepare.html)

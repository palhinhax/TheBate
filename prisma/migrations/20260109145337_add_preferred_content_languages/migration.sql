-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredContentLanguages" TEXT[] DEFAULT ARRAY['pt', 'en', 'es', 'fr', 'de']::TEXT[];

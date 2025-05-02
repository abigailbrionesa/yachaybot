-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text,
ALTER COLUMN "password" DROP NOT NULL;

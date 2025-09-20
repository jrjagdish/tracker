-- CreateTable
CREATE TABLE "public"."Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date_posted" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

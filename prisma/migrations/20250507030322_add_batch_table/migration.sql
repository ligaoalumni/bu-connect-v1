-- CreateTable
CREATE TABLE "batches" (
    "id" SERIAL NOT NULL,
    "batch" INTEGER NOT NULL,
    "images" TEXT[],

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batches_batch_key" ON "batches"("batch");

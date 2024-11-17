-- CreateTable
CREATE TABLE "RequirementCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequirementCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementSubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequirementSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequirementTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementDocument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "analysis" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequirementDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequirementCategory" ADD CONSTRAINT "RequirementCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementSubCategory" ADD CONSTRAINT "RequirementSubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RequirementCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementTag" ADD CONSTRAINT "RequirementTag_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "RequirementSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementDocument" ADD CONSTRAINT "RequirementDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

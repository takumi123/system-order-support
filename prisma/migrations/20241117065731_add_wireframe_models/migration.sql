-- CreateTable
CREATE TABLE "WireframeCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WireframeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wireframe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "svgData" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wireframe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WireframeCategory" ADD CONSTRAINT "WireframeCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wireframe" ADD CONSTRAINT "Wireframe_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WireframeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

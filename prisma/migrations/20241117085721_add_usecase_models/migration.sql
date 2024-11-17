-- CreateTable
CREATE TABLE "ProjectActor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUsecase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "precondition" TEXT,
    "postcondition" TEXT,
    "mainFlow" TEXT NOT NULL,
    "alternativeFlow" TEXT,
    "projectId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectUsecase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectActor" ADD CONSTRAINT "ProjectActor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUsecase" ADD CONSTRAINT "ProjectUsecase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUsecase" ADD CONSTRAINT "ProjectUsecase_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "ProjectActor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { type Vendor, type VendorEvaluation } from ".prisma/client";

type VendorWithEvaluations = Vendor & {
  evaluations: VendorEvaluation[];
};

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        projectId: params.projectId,
      },
      include: {
        evaluations: true,
      },
    }) as VendorWithEvaluations[];

    // 評価スコアの計算
    const vendorsWithScores = vendors.map((vendor: VendorWithEvaluations) => {
      const scores = {
        technical: 0,
        cost: 0,
        experience: 0,
        support: 0,
      };

      vendor.evaluations.forEach((evaluation: VendorEvaluation) => {
        const category = evaluation.category.toLowerCase();
        if (category in scores) {
          scores[category as keyof typeof scores] = evaluation.score;
        }
      });

      // 重み付けの定義
      const weights = {
        technical: 0.3,    // 30%
        cost: 0.25,       // 25%
        experience: 0.25,  // 25%
        support: 0.2,     // 20%
      };

      // 総合評価の計算
      const totalScore = Object.entries(scores).reduce((total, [category, score]) => {
        return total + score * weights[category as keyof typeof weights];
      }, 0);

      return {
        id: vendor.id,
        name: vendor.name,
        description: vendor.description,
        status: vendor.status,
        technicalScore: scores.technical,
        costScore: scores.cost,
        experienceScore: scores.experience,
        supportScore: scores.support,
        totalScore: Math.round(totalScore * 100) / 100,
      };
    });

    return NextResponse.json({ vendors: vendorsWithScores });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const vendor = await prisma.vendor.create({
      data: {
        name,
        description,
        status: "EVALUATING",
        projectId: params.projectId,
      },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: "Failed to create vendor" },
      { status: 500 }
    );
  }
}

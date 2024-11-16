import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上である必要があります"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received registration data:", body) // デバッグログを追加

    const validatedData = registerSchema.parse(body)
    console.log("Validated data:", validatedData) // バリデーション後のデータを確認

    const { email, password } = validatedData

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "このメールアドレスは既に登録されています" },
        { status: 400 }
      )
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12)

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json(
      { message: "ユーザーが正常に作成されました", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error) // エラーの詳細をログ出力

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "入力データが無効です", 
          errors: error.errors.map(err => ({
            message: err.message,
            path: err.path.join('.')
          }))
        },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "ユーザー登録中にエラーが発生しました" },
      { status: 500 }
    )
  }
}

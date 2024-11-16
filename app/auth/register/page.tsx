import { auth } from "@/app/auth"
import { redirect } from "next/navigation"
import RegisterForm from "../register/register-form"

export default async function RegisterPage() {
  const session = await auth()
  
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新規アカウント登録
          </h2>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

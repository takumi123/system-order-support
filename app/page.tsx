export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">ようこそ</h1>
      <p className="text-xl">
        アカウントをお持ちでない方は
        <a href="/auth/register" className="text-blue-600 hover:underline">
          こちら
        </a>
        から登録してください。
      </p>
    </main>
  )
}

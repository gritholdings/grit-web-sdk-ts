import LoginForm from "@/app/components/shadcn/block/authentication-02"

export const description = "A simple login form."

export const iframeHeight = "870px"

export const containerClassName = "w-full h-full"

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  )
}
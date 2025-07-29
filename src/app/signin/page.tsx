'use client'


import { useState } from "react"
import { isAxiosError } from "axios"
import { useRouter } from "next/navigation"

import { userApi } from "@/apis/userApi"
import IconImage from "@/components/IconImage"
import Input from "@/components/Input"
import Button from "@/components/Button"

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const userId = await userApi.signIn({email, password})
      if (userId) {
        localStorage.setItem("userId", userId)
        setSuccess(true)
        setTimeout(() => {
          router.push('/kanban')
        }, 1000)
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message || 'Sign in failed'
        setError(message)
      } else {
        setError('Unexpected error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-md shadow">
        <div className="flex flex-row mb-6">
          <IconImage />
          <h2 className="font-bold text-xl pl-2">Kanban App</h2>
        </div>
        <h1 className="font-bold mb-4 text-2xl">Sign in</h1>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">Signed in successfully!</p>}

        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-4">
            <Input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input name="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="submit">{loading ? 'Signing in...' : 'Sign in'}</Button>
          </form>
        )}

        <p className="text-center text-sm mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-500 font-semibold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}

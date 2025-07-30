'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

import rawAxios from "axios"

import { userApi } from "@/apis/userApi"
import IconImage from "@/components/IconImage"
import Input from "@/components/Input"
import Button from "@/components/Button"

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const defaultAvatar = '/images/avatar.png'
      const userId = await userApi.create({ name, email, password, avatar: defaultAvatar })

      if (userId) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/signin')
        }, 2000)
      } else {
        setError('Sign up failed')
      }
    } catch (err: unknown) {
      if (rawAxios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Sign up failed'
        setError(message)
      } else {
        setError('An unexpected error occurred')
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

        <h1 className="font-bold mb-4 text-2xl">Sign up</h1>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">Signed up successfully!</p>}

        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-4">
            <Input
              name="name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
        )}

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/signin" className="text-blue-500 font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

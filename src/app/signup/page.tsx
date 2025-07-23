'use client'

import { useState } from "react"
import axios from "@/lib/axios"
import { isAxiosError } from "axios"
import IconImage from "@/components/IconImage"
import Input from "@/components/Input"
import Button from "@/components/Button"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form...") 
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await axios.post('/api/signup', {
        name,
        email,
        password,
      })

      console.log(res.data)

      if (res.status === 201 && res.data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/signin')
        }, 2000)
      } else {
        setError('Sign up failed')
      }
    } catch (err) {
      if (isAxiosError(err)) {
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

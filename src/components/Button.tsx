'use client'

import React from "react"

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    danger: 'bg-red-500 hover:bg-red-600',
  }

  const finalClass = `${variantClasses[variant]} rounded-md cursor-pointer border border-black text-white p-2 ${className}`

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={finalClass}
    >
      {children}
    </button>
  )
}

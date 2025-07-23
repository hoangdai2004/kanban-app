'use client'

import React from "react"

type InputProps = {
    name: string
    type?: string
    placeholder?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    className?: string
}

export default function Input({
    name,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    required = false,
    className ='',
}: InputProps) {
    return (
    <div className="flex flex-col gap-1">
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`rounded-md bg-white border border-black p-2 ${className}`}
      />
    </div>
  )
}
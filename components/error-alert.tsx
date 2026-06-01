'use client'

import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription } from './ui/alert'

interface ErrorAlertProps {
  message: string
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <Alert className="border-destructive/50 bg-destructive/10">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <AlertDescription className="text-destructive">
        {message}
      </AlertDescription>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  )
}

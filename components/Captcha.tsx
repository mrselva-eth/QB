"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Skeleton } from "@/components/ui/skeleton"

interface CaptchaProps {
  onVerify: (token: string) => void
}

declare global {
  interface Window {
    grecaptcha: any
    onCaptchaLoad: () => void
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export default function Captcha({ onVerify }: CaptchaProps) {
  const captchaRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Define the callback function for when reCAPTCHA script loads
    window.onCaptchaLoad = () => {
      try {
        if (captchaRef.current && window.grecaptcha) {
          // Render the checkbox version of reCAPTCHA
          window.grecaptcha.render(captchaRef.current, {
            sitekey: SITE_KEY,
            size: "normal", // normal size checkbox
            theme: "light", // light theme
            callback: onVerify, // success callback
            "expired-callback": () => {
              setError("CAPTCHA expired. Please check the box again.")
              if (captchaRef.current) {
                window.grecaptcha.reset()
              }
            },
            "error-callback": () => {
              setError("Error loading CAPTCHA. Please refresh and try again.")
            },
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error rendering CAPTCHA:", error)
        setError("Failed to load CAPTCHA. Please refresh the page.")
        setIsLoading(false)
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.onCaptchaLoad = () => {}
      }
    }
  }, [onVerify])

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?onload=onCaptchaLoad&render=explicit`}
        strategy="afterInteractive"
      />
      <div className="flex flex-col items-center gap-4">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-[78px] w-[304px] bg-gray-100" />
            <p className="text-sm text-muted-foreground text-center">Loading CAPTCHA...</p>
          </div>
        )}
        <div
          ref={captchaRef}
          className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        />
      </div>
    </>
  )
}


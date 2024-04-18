import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import Auth0LoginLink from '../components/Auth0LoginLink'

export default function Auth0Login() {
  const [ error, setError ] = useState("")
  const [ searchParams, setSearchParams ] = useSearchParams()
  const [ success, setSuccess ] = useState(false)
  const authCode = searchParams.get("code")

  console.log("== authCode:", authCode)
  useEffect(() => {
    async function exchangeForAccessToken(code) {
      const res = await fetch("/api/tokenExchange", {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.status !== 200) {
        setError("Error exchanging code for token")
      } else {
        setSuccess(true)
      }
    }
    if (authCode) {
      exchangeForAccessToken(authCode)
    }
  }, [ authCode ])

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {success ? <p>Success!</p> : <Auth0LoginLink />}
    </div>
  )
}

import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import logoCockpit from '../assets/logo-cockpit.svg?url'

/* NOTE: a client-side demo gate, not authentication — the password ships
   in the bundle. Currently not mounted by App.jsx. */
const CORRECT_PASSWORD = 'loanscape'

export default function LoginPage({ onLogin }) {
  const [password,  setPassword]  = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [error,     setError]     = useState(false)
  const [shaking,   setShaking]   = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  function handleChange(e) {
    setPassword(e.target.value)
    if (error) setError(false)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-page">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(0,125,87,0.12)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div
        className={[
          'relative m-4 flex w-full max-w-[400px] flex-col gap-6 border border-line bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
          'rounded-lg px-6 pb-7 pt-8 sm:rounded-2xl sm:px-9 sm:pb-9 sm:pt-10',
          shaking ? 'animate-login-shake' : '',
        ].join(' ')}
      >

        {/* Logo */}
        <div className="flex items-center gap-[14px]">
          <img src={logoCockpit} alt="Cockpit" width="52" height="52" />
          <span className="text-[26px] font-bold leading-[1.2] tracking-[-0.3px] text-major">Cockpit</span>
        </div>

        <div className="-mx-6 h-px bg-line sm:-mx-9" />

        {/* Heading */}
        <div>
          <h1 className="m-0 mb-1 text-2xl font-bold leading-[1.25] text-major">Welcome back</h1>
          <p className="m-0 text-base leading-[1.5] text-minor">Enter your password to access Cockpit.</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold leading-[1.3] text-major" htmlFor="login-pw">Password</label>
            <div className="relative flex items-center">
              <input
                id="login-pw"
                className={[
                  'h-[42px] w-full rounded border bg-page py-0 pl-3.5 pr-[42px] text-base text-major outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-minor',
                  error
                    ? 'border-danger shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
                    : 'border-line focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,125,87,0.14)]',
                ].join(' ')}
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                className="absolute right-3 flex items-center justify-center rounded p-1 text-minor transition-colors duration-150 hover:text-major"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
              </button>
            </div>
            {error && (
              <p className="m-0 text-xs leading-[1.4] text-danger">Incorrect password. Please try again.</p>
            )}
          </div>

          <button
            className="mt-1 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded border border-primary bg-primary text-base font-semibold text-reverse transition-colors duration-150 hover:border-primary-hover hover:bg-primary-hover"
            type="submit"
          >
            <LogIn size={16} strokeWidth={2} />
            Sign in
          </button>

        </form>

      </div>
    </div>
  )
}

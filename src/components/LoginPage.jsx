import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import logoCockpit from '../assets/logo-cockpit.svg?url'
import './LoginPage.css'

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
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-page__bg" aria-hidden="true" />

      <div className={`login-card${shaking ? ' login-card--shake' : ''}`}>

        {/* Logo */}
        <div className="login-card__logo">
          <img src={logoCockpit} alt="Cockpit" width="52" height="52" />
          <span className="login-card__app-name">Cockpit</span>
        </div>

        <div className="login-card__divider" />

        {/* Heading */}
        <div className="login-card__heading">
          <h1 className="login-card__title">Welcome back</h1>
          <p className="login-card__subtitle">Enter your password to access Cockpit.</p>
        </div>

        {/* Form */}
        <form className="login-card__form" onSubmit={handleSubmit} noValidate>

          <div className={`login-field${error ? ' login-field--error' : ''}`}>
            <label className="login-field__label" htmlFor="login-pw">Password</label>
            <div className="login-field__wrap">
              <input
                id="login-pw"
                className="login-field__input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                className="login-field__eye"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
              </button>
            </div>
            {error && (
              <p className="login-field__error-msg">Incorrect password. Please try again.</p>
            )}
          </div>

          <button className="login-card__submit" type="submit">
            <LogIn size={16} strokeWidth={2} />
            Sign in
          </button>

        </form>

      </div>
    </div>
  )
}

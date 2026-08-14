'use client'

import Image from 'next/image'

const ERROR_MESSAGES: Record<string, string> = {
  oauth_denied: 'Authorization was denied. Please try again.',
  token_exchange: 'Failed to authenticate with Slack. Please try again.',
  missing_user_data: 'Could not retrieve your Slack profile. Please try again.',
  unauthorized_workspace: 'You are not a member of the authorized Eight34 workspace.',
  account_disabled: 'Your account has been disabled. Contact an administrator.',
  awaiting_approval: 'Your account is pending approval. Contact an administrator.',
  user_creation: 'An error occurred creating your account. Please try again.',
  server_error: 'An unexpected error occurred. Please try again.',
  profile_fetch: 'Failed to retrieve your Slack profile. Please try again.',
}

interface LoginPageProps {
  error?: string
}

export default function LoginPage({ error }: LoginPageProps) {
  const errorMessage = error ? ERROR_MESSAGES[error] || 'An error occurred. Please try again.' : null

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-brand">
          <E34Logo />
        </div>
        <div className="login-tagline">
          <p>Internal Revenue &amp; Sales Management</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-e34-mark">
              <E34Mark />
            </div>
            <h1 className="login-title">Sign in to Eight34 ERM</h1>
            <p className="login-subtitle">
              Use your Eight34 Labs Slack account to continue.
            </p>
          </div>

          {errorMessage && (
            <div className="login-error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMessage}
            </div>
          )}

          <a href="/api/auth/slack" className="slack-btn">
            <SlackIcon />
            Continue with Slack
          </a>

          <p className="login-notice">
            Access is restricted to authorized Eight34 Labs workspace members.
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-root {
          display: flex;
          min-height: 100vh;
          background: var(--paper);
        }

        .login-left {
          width: 420px;
          flex-shrink: 0;
          background: var(--e34-accent);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgb(255 255 255 / 0.03);
        }

        .login-left::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: rgb(255 255 255 / 0.03);
        }

        .login-brand {
          position: relative;
          z-index: 1;
        }

        .login-tagline {
          position: relative;
          z-index: 1;
        }

        .login-tagline p {
          font-size: 13px;
          color: rgb(255 255 255 / 0.45);
          letter-spacing: 0.02em;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }

        .login-form-container {
          width: 100%;
          max-width: 360px;
        }

        .login-header {
          margin-bottom: 32px;
        }

        .login-e34-mark {
          margin-bottom: 20px;
        }

        .login-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--ink-900);
          margin: 0 0 8px;
        }

        .login-subtitle {
          font-size: 14px;
          color: var(--ink-500);
          margin: 0;
          line-height: 1.5;
        }

        .login-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: var(--radius);
          color: #991b1b;
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        .login-error svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .slack-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 11px 16px;
          background: var(--surface);
          border: 1px solid var(--ink-200);
          border-radius: var(--radius);
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-800);
          cursor: pointer;
          transition: background var(--transition), border-color var(--transition), box-shadow var(--transition);
          text-decoration: none;
          letter-spacing: -0.005em;
          box-shadow: var(--shadow-xs);
        }

        .slack-btn:hover {
          background: var(--ink-50);
          border-color: var(--ink-300);
          box-shadow: var(--shadow-sm);
        }

        .login-notice {
          margin-top: 16px;
          font-size: 12px;
          color: var(--ink-400);
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .login-left {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

function E34Logo() {
  return (
    <Image
      src="/Eight34_Full.svg"
      alt="Eight34 Labs"
      width={160}
      height={44}
      style={{ objectFit: 'contain', objectPosition: 'left', filter: 'brightness(0) invert(1)' }}
      priority
    />
  )
}

function E34Mark() {
  return (
    <Image
      src="/E34_Short.svg"
      alt="E34"
      width={36}
      height={36}
      style={{ objectFit: 'contain' }}
    />
  )
}

function SlackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386" fill="#36C5F0"/>
      <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387" fill="#2EB67D"/>
      <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386" fill="#ECB22E"/>
      <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.249m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.249a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387" fill="#E01E5A"/>
    </svg>
  )
}

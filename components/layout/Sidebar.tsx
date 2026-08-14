'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn, getInitials, ROLE_LABELS } from '@/lib/utils'
import type { User } from '@/types'

interface SidebarProps {
  user: User
}

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/leads',
    label: 'Leads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/training',
    label: 'Training',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link href="/dashboard" className="sidebar-logo-link">
          <Image
            src="/E34_Short.svg"
            alt="E34"
            width={26}
            height={26}
            className="sidebar-e34-img"
          />
          <span className="sidebar-brand-name">Eight34</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('nav-item', isActive(item.href) && 'active')}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User */}
      <div className="sidebar-user">
        <div className="sidebar-user-inner">
          <div className="sidebar-avatar">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.name}
                width={28}
                height={28}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className="sidebar-avatar-initials">{getInitials(user.name)}</span>
            )}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.name.split(' ')[0]}</span>
            <span className="sidebar-user-role">{ROLE_LABELS[user.role]}</span>
          </div>
        </div>
        <form action="/api/auth/logout" method="GET">
          <button
            type="submit"
            className="sidebar-logout"
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .sidebar-logo {
          padding: 16px 14px;
          border-bottom: 1px solid var(--ink-100);
        }

        .sidebar-logo-link {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .sidebar-e34-img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .sidebar-brand-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--ink-900);
          letter-spacing: -0.025em;
        }

        .sidebar-nav {
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sidebar-user {
          padding: 10px 8px 12px;
          border-top: 1px solid var(--ink-100);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .sidebar-user-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          flex: 1;
        }

        .sidebar-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--ink-100);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .sidebar-avatar-initials {
          font-size: 11px;
          font-weight: 700;
          color: var(--ink-500);
          letter-spacing: 0.02em;
        }

        .sidebar-user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sidebar-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-800);
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-user-role {
          font-size: 11px;
          color: var(--ink-400);
          letter-spacing: 0.01em;
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius);
          border: 1px solid transparent;
          background: transparent;
          color: var(--ink-400);
          cursor: pointer;
          transition: background var(--transition), color var(--transition), border-color var(--transition);
          flex-shrink: 0;
          padding: 0;
        }

        .sidebar-logout:hover {
          background: var(--ink-50);
          color: var(--ink-700);
          border-color: var(--ink-150);
        }
      `}</style>
    </aside>
  )
}

// src/components/layout/AppSidebar.jsx
import { useState } from "react";
import { useAuth } from "../store/AuthContext";
import '../../styles/Sidebar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// ── Role-based menu config ────────────────────────────────────────────────────

const adminMenu = [
  {
    label: "Dashboard",
    icon: "bi-speedometer2",
    children: null,
    href: "/admin",
  },
  {
    label: "Odds Manager",
    icon: "bi-grid",
    children: null,
    href: "/oddsManager",
  },
  {
    label: "File Uploader",
    icon: "bi-puzzle",
    children: null,
    href: "/fileUploader",
  },
  {
    label: "Reports",
    icon: "bi-bar-chart",
    children: null,
    href: "/reports",
  },
  {
    label: "Deposit Approvals",
    icon: "bi-cash-stack",
    children: null,
    href: "/depositApprove",
  },
];

const userMenu = [
  {
    label: "Race Selection",
    icon: "bi-flag",
    children: null,
    href: "/dashboard",
  },
  {
    label: "Bet Now",
    icon: "bi-lightning",
    children: null,
    href: "/betting",
  },
  {
    label: "Betting History",
    icon: "bi-clock-history",
    children: null,
    href: "/history",
  },
];

/**
 * Props:
 *   collapsed   : boolean  — icon-only mode on desktop
 *   onCollapse  : fn       — toggle collapsed
 *   mobileOpen  : boolean  — drawer open on mobile
 *   onClose     : fn       — close mobile drawer
 */
export default function AppSidebar({ collapsed, onCollapse, mobileOpen, onClose }) {
  const { user, logout } = useAuth();                          // ← pull user + logout
  const [openMenus, setOpenMenus] = useState({});

  // ── Pick menu based on role ───────────────────────────────────────────────
  const menuItems = user?.role === "Admin" ? adminMenu : userMenu;
  const currentPath = window.location.pathname;

  const toggle = (label) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  const cls = ["sidebar", collapsed && "collapsed", mobileOpen && "mobile-open"]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && <div className="sidebar-backdrop d-lg-none" onClick={onClose} />}

      <div className={cls}>

        {/* ── Logo row ───────────────────────────── */}
        <div className="sidebar-logo">
          {collapsed
            ? <span style={{ color: "#fff", fontWeight: 700, margin: "0 auto" }}>◈</span>
            : (
              <div className="d-flex align-items-center gap-2">
                <a href="/">TrackPulse</a>
                {/* Role badge */}
                {user && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 10,
                      background: user.role === "admin"
                        ? "rgba(239,68,68,0.15)"
                        : "rgba(27,132,255,0.15)",
                      color: user.role === "admin" ? "#ef4444" : "#1b84ff",
                    }}
                  >
                    {user.role}
                  </span>
                )}
              </div>
            )
          }
          <button
            className="collapse-btn d-none d-lg-inline"
            onClick={onCollapse}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <i className={`bi bi-chevron-${collapsed ? "right" : "left"}`} />
          </button>
        </div>

        {/* ── Nav menu ───────────────────────────── */}
        <nav className="sidebar-menu">

          <div className="sidebar-section-label">
            {user?.role === "admin" ? "Admin Menu" : "Menu"}
          </div>

          {menuItems.map((item) =>
            item.children ? (
              // Parent with submenu
              <div key={item.label}>
                <button
                  className={`menu-btn ${openMenus[item.label] ? "is-open is-active" : ""}`}
                  onClick={() => toggle(item.label)}
                  title={collapsed ? item.label : undefined}
                >
                  <i className={`bi ${item.icon} menu-icon`} />
                  <span className="menu-label">{item.label}</span>
                  <i className="bi bi-chevron-down menu-arrow" />
                </button>

                <div className={`submenu ${openMenus[item.label] && !collapsed ? "is-open" : ""}`}>
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className={currentPath === child.href ? "current" : ""}
                    >
                      <span className="submenu-dot" />
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              // Direct link — no children
              <a
                key={item.label}
                href={item.href}
                className={`menu-btn ${currentPath === item.href ? "current" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <i className={`bi ${item.icon} menu-icon`} />
                <span className="menu-label">{item.label}</span>
              </a>
            )
          )}

          

        </nav>

        {/* ── User info strip (footer) ────────────── */}
        {!collapsed && user && (
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Avatar initial */}
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: user.role === "admin" ? "#ef4444" : "#1b84ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}
            >
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            {/* Name + email */}
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </div>
              <div style={{ color: "#4a5070", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
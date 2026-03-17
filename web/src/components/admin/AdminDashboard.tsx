
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";

const layoutStyles = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #f9f9f9; font-family: 'Segoe UI', system-ui, sans-serif; }

  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .app-body {
    
    flex: 1;
  }
  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: margin-left 0.3s ease;
  }
  .app-toolbar {
    background: #fff;
    border-bottom: 1px solid #f1f1f4;
    padding: 14px 24px;
  }
  .page-heading {
    font-size: 18px;
    font-weight: 700;
    color: #071437;
    margin: 0;
    line-height: 1.3;
  }
  .breadcrumb {
    margin: 4px 0 0;
    padding: 0;
    background: none;
  }
  .breadcrumb-item {
    font-size: 12px;
    color: #99a1b7;
    font-weight: 500;
  }
  .breadcrumb-item a {
    color: #99a1b7;
    text-decoration: none;
  }
  .breadcrumb-item a:hover { color: #1b84ff; }
  .breadcrumb-item + .breadcrumb-item::before {
    content: "›";
    color: #c4cada;
  }
  .app-content {
    flex: 1;
    padding: 24px;
  }
`;

export default function AppLayout({ children, title = "Dashboard", breadcrumbs = [] }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 70 : 265;

  return (
    <>
      <style>{layoutStyles}</style>
      <div className="app-layout">

        <Header onSidebarToggle={() => setMobileSidebarOpen((v) => !v)} />

        <div className="app-body">

          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
            mobileOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />

          <div className="app-main" style={{ marginLeft: sidebarWidth }}>

            {/* Toolbar */}
            <div className="app-toolbar">
              <h1 className="page-heading">{title}</h1>
              {breadcrumbs.length > 0 && (
                <ol className="breadcrumb">
                  {breadcrumbs.map((crumb, i) => (
                    <li key={i} className={`breadcrumb-item ${i === breadcrumbs.length - 1 ? "active" : ""}`}>
                      {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : crumb.label}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Page content */}
            <div className="app-content">
              {children}
            </div>

            <Footer />
          </div>

        </div>
      </div>
    </>
  );
}
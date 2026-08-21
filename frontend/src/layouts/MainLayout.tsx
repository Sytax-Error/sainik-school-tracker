import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Boxes, LayoutDashboard, Menu, X } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const location = useLocation();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/phase/1", label: "Phase 1", icon: Boxes },
    { path: "/phase/2", label: "Phase 2", icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-surface-page lg:flex">
      <aside className="app-sidebar hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-sticky lg:flex lg:w-64 lg:flex-col lg:overflow-y-auto">
        <Link to="/" className="flex items-center gap-3 px-7 py-7" aria-label="Sainik School Tracker home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>
            <span className="block text-sm font-semibold text-white">Sainik School</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Project tracker</span>
          </span>
        </Link>
        <div className="px-5 pt-8">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Workspace</p>
          <nav className="mt-3 space-y-1" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? "sidebar-link-active" : ""}`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto px-7 pb-7">
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-xs font-semibold text-white/80">Project status</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/55">
              <span className="h-2 w-2 rounded-full bg-semantic-success-main" aria-hidden="true" />
              Tracking active
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="app-header sticky top-0 z-sticky">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
            <Link to="/" className="flex items-center gap-3 lg:hidden" aria-label="Sainik School Tracker home">
              <span className="brand-mark" aria-hidden="true">S</span>
              <span className="text-sm font-semibold text-white">Sainik School</span>
            </Link>
            <p className="hidden text-sm font-medium text-white/60 lg:block">Project control center</p>
            <button
              type="button"
              className="mobile-nav-toggle lg:hidden"
              onClick={() => setMobileNavigationOpen((isOpen) => !isOpen)}
              aria-expanded={mobileNavigationOpen}
              aria-controls="mobile-navigation"
            >
              {mobileNavigationOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/55 lg:flex"><Activity className="h-3.5 w-3.5 text-semantic-success-main" /> Live workspace</span>
          </div>
          {mobileNavigationOpen && (
            <nav id="mobile-navigation" className="border-t border-white/10 px-4 py-3 lg:hidden" aria-label="Primary navigation">
              <div className="grid grid-cols-3 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileNavigationOpen(false)}
                    className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${location.pathname === item.path ? "bg-primary-600 text-white" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}

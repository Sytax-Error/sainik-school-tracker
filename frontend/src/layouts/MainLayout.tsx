import { Link, useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/phase/1", label: "Phase 1" },
    { path: "/phase/2", label: "Phase 2" },
  ];

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="bg-surface-primary border-b border-surface-border sticky top-0 z-sticky">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-text-primary">
                Sainik School Tracker
              </Link>
            </div>
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                    location.pathname === item.path
                      ? "bg-primary-100 text-primary-700"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

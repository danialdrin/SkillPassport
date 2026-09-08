import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Award, LogOut, Menu, Network, Search, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { UploadModal } from "../resources/UploadModal";

export const TopBar: React.FC = () => {
  const { user, status, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ingestModalOpen, setIngestModalOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/home", icon: Network },
    { label: "Skill Gap", path: "/skill-graph", icon: Network },
    { label: "Digital Passport", path: "/passport", icon: Award },
  ];

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", closeMenus);
    return () => window.removeEventListener("keydown", closeMenus);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/search?query=${encodeURIComponent(query)}` : "/search");
  };

  const userInitial = user?.name ? user.name[0].toUpperCase() : "D";

  return (
    <header className="sticky top-0 z-40 w-full bg-paper/95 backdrop-blur-md border-b border-line/40">
      <div className="flex min-h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Left: Menu Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 min-w-9">
          {status === "authenticated" && (
            <div className="relative">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-surface transition-colors"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              {menuOpen && (
                <nav
                  id="top-navigation-menu"
                  className="absolute left-0 top-11 z-50 w-56 space-y-1 border border-line bg-surface p-2 shadow-md rounded-xl"
                  aria-label="Primary navigation"
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-paper text-ink font-semibold border border-line"
                            : "text-ink-muted hover:bg-paper/70 hover:text-ink"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>
          )}
        </div>

        {/* Center: Search Input + Ingest Button */}
        {status === "authenticated" && (
          <div className="flex flex-1 items-center justify-center gap-2 max-w-xl mx-auto px-1 sm:px-2">
            <form onSubmit={handleSearch} className="relative flex-1 min-w-0">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search anything..."
                className="h-10 w-full rounded-full border border-line bg-surface/80 pl-4 pr-10 text-xs sm:text-sm text-ink placeholder:text-ink-muted/70 shadow-xs focus:border-ink/40 focus:bg-surface focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-stone-700 text-white hover:bg-stone-900 transition-colors shadow-xs"
                aria-label="Submit search"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIngestModalOpen(true)}
              className="h-10 rounded-full px-3.5 sm:px-4 text-xs font-semibold shrink-0 gap-1.5 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Ingest</span>
            </Button>
          </div>
        )}

        {/* Right: User Avatar Circle */}
        <div className="relative shrink-0 flex items-center justify-end gap-3 min-w-9">
          {status === "authenticated" && user ? (
            <>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-300 font-semibold text-stone-800 text-sm hover:ring-2 hover:ring-stone-400 transition-all shadow-sm"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {userInitial}
              </button>

              {profileOpen && (
                <div
                  id="profile-menu"
                  className="absolute right-0 top-11 z-50 w-56 border border-line bg-surface p-3 shadow-md rounded-xl"
                >
                  <span className="block truncate text-xs font-semibold text-ink">
                    {user.name}
                  </span>
                  <span className="block truncate text-[10px] text-ink-muted font-mono">
                    {user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    title="Sign out"
                    className="mt-3 h-8 w-full justify-center text-xs text-ink-muted hover:border-gap hover:text-gap rounded-lg"
                  >
                    <LogOut className="mr-1 h-3.5 w-3.5" />
                    Exit
                  </Button>
                </div>
              )}
            </>
          ) : status === "anonymous" ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="rounded-full">
                  Get Started
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Ingest Learning Material Modal */}
      <UploadModal open={ingestModalOpen} onOpenChange={setIngestModalOpen} />
    </header>
  );
};

import type { ReactNode } from "react";
import "./Layout.css";
import deltaCapitaLogo from "../assets/delta-capita-logo.png";

type LayoutProps = {
  children: ReactNode;
  role?: "Admin" | "Candidate";
};

function Layout({
  children,
  role,
}: LayoutProps) {
  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="brand">
          <img
            src={deltaCapitaLogo}
            alt="Delta Capita"
            className="brand-logo"
          />

          <div className="brand-divider" />

          <div className="brand-product">
            <span>DeltaCode</span>
            <small>Assessment Platform</small>
          </div>
        </div>

        {role && (
          <div className="user-role">
            <span className="role-dot" />
            {role}
          </div>
        )}
      </header>

      <main className="page-content">
        {children}
      </main>

      <footer className="app-footer">
        <div className="footer-left">
          <span className="footer-brand">
            DELTACODE
          </span>

          <span className="footer-divider">
            •
          </span>

          <span>
            Assessment Platform
          </span>
        </div>

        <div className="footer-right">
          Created by:{" "}
          <span>
            Akash
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
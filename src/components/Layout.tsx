import type { ReactNode } from "react";
import "./Layout.css";

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
          <span className="brand-mark">DC</span>

          <div>
            <div className="brand-name">
              DELTA CAPITA
            </div>

            <div className="brand-product">
              DeltaCode
            </div>
          </div>
        </div>

        {role && (
          <div className="user-role">
            {role}
          </div>
        )}
      </header>

      <main className="page-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
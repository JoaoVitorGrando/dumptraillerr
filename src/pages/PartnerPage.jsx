import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Partner, { PARTNER_TABS_INDEX } from "../components/Partner";

/* -------------------------------------------------------------------------- */
/* Partner pages                                                              */
/* -------------------------------------------------------------------------- */
/*   /partner            -> overview tabs (default Owner)                     */
/*   /partner/owner      -> Owner form preselected                            */
/*   /partner/customer   -> Customer form preselected                         */
/*   /partner/driver     -> Driver form preselected                           */
/* All forms post through services/leads.js with the right formType.         */
/* -------------------------------------------------------------------------- */

export default function PartnerPage() {
  const { role } = useParams();

  // Reset scroll on route change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [role]);

  if (role && !PARTNER_TABS_INDEX.includes(role)) {
    return <Navigate to="/partner" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />

      <main className="flex-1 pt-32 sm:pt-36 md:pt-40">
        {/* Slim breadcrumb header above the partner section */}
        <div className="container-page pb-2">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
            <Link to="/" className="hover:text-brand-orange">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/partner" className="hover:text-brand-orange">
              Partner
            </Link>
            {role && (
              <>
                <span className="mx-2">/</span>
                <span className="capitalize text-brand-dark">{role}</span>
              </>
            )}
          </nav>
        </div>

        <Partner initialTab={role || "owner"} />
      </main>

      <Footer />
    </div>
  );
}

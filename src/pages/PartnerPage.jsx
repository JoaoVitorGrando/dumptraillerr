import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
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

      <main className="flex-1">
        <Partner initialTab={role || "owner"} />
      </main>

      <Footer />
    </div>
  );
}

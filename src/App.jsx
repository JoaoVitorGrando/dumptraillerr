import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import Trailers from "./components/Trailers";
import Rules from "./components/Rules";
import BookingForm from "./components/BookingForm";
import Payment from "./components/Payment";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

// Root layout for the Dump Trailer Rental landing page
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <Trailers />
        <HowItWorks />
        <Rules />
        <BookingForm />
        <Payment />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

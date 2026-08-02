import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingCart from "../components/common/FloatingCart";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-vh-100">
        <Outlet />
      </main>
      <FloatingCart />
      <Footer />
    </>
  );
}

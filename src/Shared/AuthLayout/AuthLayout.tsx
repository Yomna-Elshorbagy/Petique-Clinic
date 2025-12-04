import { Outlet } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router";

export default function AuthLayout() {
  const location = useLocation();
  return (
    <>
    <AnimatePresence mode="wait">
    <Outlet key={location.pathname} />
    </AnimatePresence>
    </>
  );
}

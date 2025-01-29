"use client"
// app/dashboard/layout.js
import Header from "../../components/Header"; // Import Header component

export default function DashboardLayout({ children }) {
  return (
    <div className="relative">
      {/* Include Header on every page */}
      <Header />
      {/* Main content for the page */}
      <main className="pt-0">{children}</main> {/* Adjust padding if needed */}
    </div>
  );
}

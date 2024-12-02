// app/layout.tsx
import React, { ReactNode } from "react";
import Header from "./component/header"; // Adjust the import path as needed
import "../../styles/globals.css"; // Import global styles
import Footer from "./component/footer"; // Adjust the import path as needed
// Define props type
interface RootLayoutProps {
  children: ReactNode; // Type for children
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Header /> {/* Render Header here */}
        {children} {/* Render child pages here */}
        <Footer /> {/* Render Footer here */}
      </body>
    </html>
  );
};

export default RootLayout;

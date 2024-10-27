// app/component/header.tsx
"use client"; // Ensure this is at the top

import React from "react";
import { useRouter } from "next/navigation"; // Use the correct import for the App Router
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const buttonStyles = {
  color: "#15143966", // Text color
  fontFamily: "DM Sans, sans-serif", // Ensure proper font family
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "28px",
  padding: "10px 20px", // Add padding for a better click area
  position: "relative", // Set position to relative
  textDecoration: "none", // Prevent default text underline
  textTransform: "none", // Prevent default text transformation
  "&:hover": {
    // color: "#ffffff", // Change text color on hover
    // fontWeight: 700, // Change font weight on hover
    "&::after": {
      transform: "scaleX(1)", // Scale to full width on hover
    },
  },
  "&::after": {
    content: '""', // Empty content for the pseudo-element
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // Position it at the bottom
    height: "2px", // Height of the underline
    backgroundColor: "#AC7575", // Color of the underline
    transform: "scaleX(0)", // Initially scale it to 0
    transition: "transform 0.3s ease", // Smooth transition
  },
};

const Header = () => {
  const router = useRouter(); // Use the router here

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Toolbar className="flex justify-between px-32 mt-8">
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: "#AC7575",
            textAlign: "center",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          OpenCV
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            marginLeft: "75px",
          }}
        >
          <Button
            color="inherit"
            sx={buttonStyles}
            onClick={() => router.push("/")}
          >
            Home
          </Button>
          <Button
            color="inherit"
            sx={buttonStyles}
            onClick={() => router.push("/about")}
          >
            About
          </Button>
          <Button
            color="inherit"
            sx={buttonStyles}
            onClick={() => router.push("/contact")}
          >
            Contact
          </Button>
          <Button
            color="inherit"
            sx={buttonStyles}
            onClick={() => router.push("/blog")}
          >
            Blog
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "100px",
              color: "#15143966",
              border: "none",
              fontWeight: 500,
              width: "100px",
              height: "40px",
            }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: "100px",
              backgroundColor: "#AC7575",
              border: "none",
              fontWeight: 500,
              width: "100px",
              height: "40px",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

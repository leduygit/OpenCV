import Image from "next/image";
import Button from "@mui/material/Button"; // Import MUI Button for the Get Started button

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      {/* Welcome Text */}

      <div className="text-center">
        {" "}
        {/* Reduced margin-bottom to raise the text */}
        <h1
          className="text-[#0B1344] text-center
            font-sans text-6xl font-bold leading-[86px] tracking[-1px]"
        >
          Startup Framework
        </h1>
        <div className="mx-8">
          <div className="mx-8">
            <p className="mt-8 text-[#15143966] text-center font-sans font-bold text-[22px] font-normal h-[96x] w-[582px]">
              We made it so beautiful and simple. It combines landings, pages,
              blogs, and shop screens. It is definitely the tool you need in
              your collection!
            </p>
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="mt-24">
        {" "}
        {/* Adjusted positioning of the button */}
        <Button
          variant="contained"
          sx={{
            borderRadius: "100px",
            backgroundColor: "#AC7575",
            padding: "10px 20px",
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 500,
            fontSize: "18px",
            width: "300px",
            textTransform: "none", // Prevent default text transformation
          }}
        >
          Let's get started
        </Button>
      </div>
    </div>
  );
}

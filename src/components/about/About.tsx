import React from "react";
import Typography from "@mui/material/Typography";

const About: React.FC = () => {
  return (
    <>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="aboutTitle"
        component="div"
      >
        About
      </Typography>
      <br />
      <strong>Retails Products</strong>
      <p>Sample project for retail products (2023)</p>
    </>
  );
};

export default About;

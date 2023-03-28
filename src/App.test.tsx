import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./config/appConfig.ts", () => {
  return {
    loadConfig: () => Promise.resolve({ url: null }),
    // Promise.resolve({ url: { productsApi: "https://localhost:5001/" } }),
  };
});

test("renders App component", () => {
  render(<App />);
  const linkElement = screen.getByText(/config.json loading/i);
  expect(linkElement).toBeInTheDocument();
  // For Html/roles type: screen.getByRole('Anything'); // choose a role that does not exist.
  // Print out Html element: console.log(prettyDOM(nodeElement));
});

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// import ProductList from "./components/Products/ProductsPage";
import { loadConfig, isConfigValid } from "./config/appConfig";
import { RouterProvider } from "react-router-dom";
import { routes } from "./Routes";
import theme from "./AppMuiTheme";
import { ThemeProvider } from "@mui/material/styles";
// Font recommended by Material UI
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    // Load application configuration settings
    loadConfig().then((config) => {
      (window as any).appConfig = config;
      setConfigLoaded(true);
    });
    // let getConfig = async () => {
    //   const config = await loadConfig();
    //   (window as any).appConfig = config;
    //   setConfigLoaded(true);
    // };
    // getConfig();
  });

  return (
    // TODO: Create Error Boundary
    // <ErrorBoundary fallback={<p>Something went wrong</p>}>
    <ThemeProvider theme={theme}>
      <div className="app">
        <header className="App-header">
          {!configLoaded && <p>config.json loading</p>}
          {configLoaded && !isConfigValid() && (
            <div>config.json value issue</div>
          )}
          {/* {configLoaded && isConfigValid() && <ProductList />} */}
          {configLoaded && isConfigValid() && (
            <RouterProvider router={routes} />
          )}
        </header>
      </div>
    </ThemeProvider>
    // </ErrorBoundary>
  );
}

export default App;

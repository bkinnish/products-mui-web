import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProductList from "./components/Products/ProductsPage";
import { loadConfig, isConfigValid } from "./config/appConfig";

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
    <div className="app">
      <header className="App-header">
        {!configLoaded && <p>config.json loading</p>}
        {configLoaded && !isConfigValid() && <div>config.json value issue</div>}
        {configLoaded && isConfigValid() && <ProductList />}
      </header>
    </div>
  );
}

export default App;

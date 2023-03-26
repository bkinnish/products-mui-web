import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProductList from "./components/Products/ProductsPage";
import { loadConfig } from "./config/appConfig";

function App() {
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    loadConfig().then((resp) => {
      (window as any).appConfig = resp;
      setConfigLoaded(true);
    });
  });

  return (
    <div className="app">
      <header className="App-header">
        {!configLoaded && <p>Config.json loading</p>}
        {configLoaded && <ProductList />}
      </header>
    </div>
  );
}

export default App;

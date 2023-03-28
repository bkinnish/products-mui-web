const fs = require("fs");

fs.copyFile("src/config/config-prod.json", "build/config.json", (err) => {
  if (err) throw err;
  console.log("config-prod.json copied to build/config.json");
});

// https://stackoverflow.com/questions/56034037/why-web-config-is-needed-to-deploy-the-react-application-in-iis
fs.copyFile("web.config", "build/web.config", (err) => {
  if (err) throw err;
  console.log("web.config copied to build/web.config");
});

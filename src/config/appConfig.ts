import { isNullOrUndefined } from "../common/utils/valueCheck";

// Called once at startup
export const loadConfig = async () => {
  if (process.env.NODE_ENV !== "development") {
    console.log = function () {};
  }
  if (process.env.NODE_ENV === "production") {
    return import("./config-prod.json");
  }
  return import("./config.json");
};

interface ConfigSchema {
  url: {
    productsApi: string;
    authorisation: string;
  };
}

export const appConfig = (): ConfigSchema => {
  return {
    url: {
      productsApi: (window as any)?.appConfig?.url?.productsApi,
      authorisation: (window as any)?.appConfig?.url?.authorisation,
    },
  };
};

export const getProductsApiUrl = () => appConfig()?.url.productsApi;

export const isConfigValid = () => !isNullOrUndefined(getProductsApiUrl());

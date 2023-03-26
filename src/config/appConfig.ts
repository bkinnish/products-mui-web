
// Called once at startup
export const loadConfig = async () => {
    if (process.env.NODE_ENV !== "development") {
        console.log = function() {};
    }
    if (process.env.NODE_ENV === "production") {
        return import("./config-prod.json")
    }
    return import("./config.json")
}

interface ConfigSchema {
    url: {
        products: string;
        authorisation: string;
    }
}

// Sample: Retreive confuguration from anywhere in the application
// const productsUrl = appConfig().url.products
export const appConfig = () : ConfigSchema => {
    return {
        url: {
            products: (window as any)?.appConfig?.url?.products,
            authorisation: (window as any)?.appConfig?.url?.authorisation,
        }
    }
}

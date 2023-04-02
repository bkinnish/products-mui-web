import { ProductSortOrder } from "./productSortOrder";
import Product from "./product";
import ProductResponse from "./productResponse";
import { getProductsApiUrl } from "../../config/appConfig";
import { isNullOrUndefined } from "../../common/utils/isNullOrUndefined";

// https://developer.mozilla.org/en-US/docs/Web/API/AbortController
let controller: AbortController;

export const getProducts = (
  pageNo: number,
  sortOrder: ProductSortOrder,
  sortAsc: boolean
): Promise<ProductResponse> => {
  if (controller) {
    controller.abort();
    console.log("fetch aborted");
  }
  controller = new AbortController();

  return fetch(
    `${getProductsApiUrl()}api/product?page=${pageNo}&limit=10&sortorder=${sortOrder}&sortAsc=${sortAsc}`,
    {
      signal: controller.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error retrieving Products! ${response.statusText}`);
      }
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      return isJson ? response.json() : null;
    })
    .catch((error) => {
      // https://pgarciacamou.medium.com/using-abortcontroller-with-fetch-api-and-reactjs-8d4177e51270
      if (error.name === "AbortError") {
        return new Response(JSON.stringify({}), {
          status: 499, // Client Closed Request
          statusText: error.message || "Client Closed Request",
        });
      }
      throw new Error(error.message || "Network Connect Timeout Error");
    });

  // TODO: Move code to unit tests.
  // if (pageNo === 1) {
  //     return Promise.resolve(
  //         {
  //             products: [{id: '1', name: "Apple", price: 2.20, type: "fruit", active: true},
  //                 {id: '2', name: "Orange", price: 1.50, type: "fruit", active: true},
  //                 {id: '3', name: "Pear", price: 1.75, type: "fruit", active: true},
  //                 {id: '4', name: "Banana", price: 1.90, type: "fruit", active: true},
  //                 {id: '5', name: "Pumpkin", price: 3.00, type: "vegetable", active: true}],
  //             activePage: 1,
  //             maxPages: 2
  //         });
  // } else {
  //     return Promise.resolve(
  //         {
  //             products: [
  //                 {id: '6', name: "Potatoe", price: 1.50, type: "vegetable", active: true},
  //                 {id: '7', name: "Carrot", price: 1.95, type: "vegetable", active: true}],
  //             activePage: 2,
  //             maxPages: 2
  //         });
  // }
};

export const saveProduct = (product: Product) => {
  if (controller) {
    controller.abort();
    console.log("fetch aborted");
  }
  if (!isNullOrUndefined(product.id)) {
    return fetch(`${getProductsApiUrl()}api/product/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    }).then((response) => {
      if (response.status >= 400) {
        throw Error(`Issue saving product with id: ${product.id}`);
      }
      return;
    });
  } else {
    return fetch(`${getProductsApiUrl()}api/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(product),
    }).then((response) => {
      if (response.status >= 400) {
        throw Error(`Issue adding product: ${product.name}`);
      }
      return;
    });
  }
};

export const deleteProduct = (id: string) => {
  if (controller) {
    controller.abort();
    console.log("fetch aborted");
  }

  return fetch(`${getProductsApiUrl()}api/product/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status >= 400) {
      throw Error(`Issue deleting product with id: ${id}`);
    }
    return;
  });
};

export const getProductApiVersion = () => {
  return fetch(`${getProductsApiUrl()}api/product/version`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Error retrieving Product version! ${response.statusText}`
      );
    }
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    return isJson ? response.json() : response?.text();
  });
};

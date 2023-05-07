import { BrandSortOrder } from "./brandSortOrder";
import Brand from "./brand";
import CreateBrand from "./createBrand";
import BrandResponse from "./brandResponse";
import { getBaseApiUrl } from "../../config/appConfig";
import { isNullOrUndefined } from "../../common/utils/isNullOrUndefined";

// https://developer.mozilla.org/en-US/docs/Web/API/AbortController
let controller: AbortController;

export const getBrands = (
  pageNo: number,
  sortOrder: BrandSortOrder,
  sortAsc: boolean
): Promise<BrandResponse> => {
  if (controller) {
    controller.abort();
    console.log("fetch aborted");
  }
  controller = new AbortController();

  return fetch(
    `${getBaseApiUrl()}api/brand?page=${pageNo}&limit=10&sortorder=${sortOrder}&sortAsc=${sortAsc}`,
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
        throw new Error(`Error retrieving Brands! ${response.statusText}`);
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
};

export const saveBrand = (brand: Brand) => {
  if (controller) {
    controller.abort();
    console.log("fetch aborted");
  }
  if (!isNullOrUndefined(brand.id) && brand.id > "") {
    return fetch(`${getBaseApiUrl()}api/brand/${brand.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brand),
    }).then((response) => {
      if (response.status >= 400) {
        throw Error(`Issue saving brand with id: ${brand.id}`);
      }
      return;
    });
  } else {
    const createBrand: CreateBrand = {
      name: brand.name,
      active: brand.active,
    };
    return fetch(`${getBaseApiUrl()}api/brand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(createBrand),
    }).then((response) => {
      if (response.status >= 400) {
        throw Error(`Issue adding brand: ${brand.name}`);
      }
      return;
    });
  }
};

export const deleteBrand = (id: string) => {
  if (controller) {
    controller.abort();
    console.log("fetch aborted");
  }

  return fetch(`${getBaseApiUrl()}api/brand/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status >= 400) {
      throw Error(`Issue deleting brand with id: ${id}`);
    }
    return;
  });
};

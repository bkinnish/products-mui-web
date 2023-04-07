// https://reactrouter.com/en/main/start/tutorial
import { createBrowserRouter } from "react-router-dom";
import ProductList from "./components/Products/ProductsPage";
import { Main } from "./components/Main";
import About from "./components/about";
import NotFound from "./common/Error/NotFound";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <NotFound />,
    children: [
      {
        path: "products",
        element: <ProductList />,
      },
      {
        path: "about",
        element: <About />,
      },
      //   {
      //     element: <AuthLayout />,
      //     children: [
      //       {
      //         path: "login",
      //         element: <Login />,
      //         loader: redirectIfUser,
      //       },
      //       {
      //         path: "logout",
      //         action: logoutUser,
      //       },
      //     ],
      //   },
    ],
  },
]);

import React from "react";
import MiniDrawer, { ItemGroup } from "../common/drawer/MiniDrawer";
import InventoryIcon from "@mui/icons-material/Inventory";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import SummarizeIcon from "@mui/icons-material/Summarize";
import InfoIcon from "@mui/icons-material/Info";
import styles from "./Main.module.scss";

export function Main() {
  // See Routes.tsx for the elements that will be navigated too.

  const menuItems: ItemGroup[] = [
    {
      itemGroupNo: 1,
      items: [
        {
          text: "Products",
          icon: <InventoryIcon titleAccess={"Products"} />,
          navigateTo: "products",
        },
        {
          text: "Brands",
          icon: <BrandingWatermarkIcon titleAccess={"Brands"} />,
          navigateTo: "brands",
        },
      ],
    },
    {
      itemGroupNo: 2,
      items: [
        {
          text: "Not Found",
          icon: <SummarizeIcon titleAccess={" Not Found "} />,
          navigateTo: "notfound",
        },
        {
          text: "About",
          icon: <InfoIcon titleAccess={"About"} />,
          navigateTo: "about",
        },
      ],
    },
  ];

  return (
    <div className={styles.page}>
      <MiniDrawer appTitle="My Sample App" menuItems={menuItems}></MiniDrawer>
    </div>
  );
}

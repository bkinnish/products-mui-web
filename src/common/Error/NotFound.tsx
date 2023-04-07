import { useRouteError, Link } from "react-router-dom";
import OutlinedButton from "../../common/buttons/OutLinedButton";
import HomeIcon from "@mui/icons-material/Home";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  const error: any = useRouteError();
  console.error(error);

  const errorMessage = `${error?.status} ${error?.statusText} - ${error?.data}`;

  return (
    <div id="not-found-error-page" className={styles.notFound}>
      <h1>Retail Products</h1>
      <p>{errorMessage}</p>
      <OutlinedButton size="small" startIcon={<HomeIcon />}>
        <Link to={`/`}>Home Page </Link>
      </OutlinedButton>
    </div>
  );
};

export default NotFound;

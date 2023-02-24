import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export function SignInButton() {
  const isUserLoggedIn = true;

  return isUserLoggedIn ? (
    <>
      <button type="button" className={styles.signInButton}>
        <FaGithub color="#04D361" />
        carlosBrand15
        <FiX color="#737380" />
      </button>
    </>
  ) : (
    <>
      <button type="button" className={styles.signInButton}>
        <FaGithub color="#EBA417" />
        Sign in with Github
      </button>
    </>
  );
}

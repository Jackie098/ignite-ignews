import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";

export function SignInButton() {
  const { data: session } = useSession(); // it will be stored in cookies

  // console.log(session);

  return session ? (
    <>
      <button
        type="button"
        className={styles.signInButton}
        onClick={() => signOut()}
      >
        <FaGithub color="#04D361" />
        {session.user?.name}
        <FiX color="#737380" />
      </button>
    </>
  ) : (
    <>
      <button
        type="button"
        className={styles.signInButton}
        onClick={() => signIn("github")}
      >
        <FaGithub color="#EBA417" />
        Sign in with Github
      </button>
    </>
  );
}

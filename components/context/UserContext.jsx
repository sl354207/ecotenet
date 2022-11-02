import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  // console.log(session);

  const [user, setUser] = useState();

  useEffect(() => {
    if (status == "unauthenticated" || status == "loading") {
      setUser({
        email: "",
        name: "",
        role: "user",
        status: status,
      });
    }
    if (status == "authenticated") {
      let userName = sessionStorage.getItem("name");
      if (
        session.user.name == null ||
        session.user.name == "" ||
        session.user.name == undefined
      ) {
        setUser({
          email: session.user.email,
          name: userName,
          role: session.user.role,
          status: status,
        });
      } else {
        setUser({
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          status: status,
        });
      }
      // console.log(userName);
    }
  }, [router.pathname, status]);

  // console.log(user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // const router = useRouter();
  const { data: session, status, update } = useSession();

  const [user, setUser] = useState();

  useEffect(() => {
    if (status === "unauthenticated" || status === "loading") {
      setUser({
        email: "",
        name: "",
        role: "user",
        status: status,
      });
    }
    if (status === "authenticated") {
      setUser({
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: status,
      });
    }
  }, [status]);
  // [router.pathname, status]

  return (
    <UserContext.Provider value={{ user, setUser, update }}>
      {children}
    </UserContext.Provider>
  );
};

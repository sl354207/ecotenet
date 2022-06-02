import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { data: session, status } = useSession();
  // console.log(session);

  const [userName, setUserName] = useState(
    status == "authenticated"
      ? {
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          status: status,
        }
      : {
          email: "",
          name: "",
          role: "user",
          status: "",
        }
  );

  //   const value = useMemo(
  //     () => ({ userName, setUserName }),
  //     [userName]
  //   );

  useEffect(() => {
    status == "authenticated"
      ? setUserName({
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          status: status,
        })
      : setUserName({
          email: "",
          name: "",
          role: "user",
          status: status,
        });

    // return { userName, setUserName };
  }, [status]);
  console.log(userName);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

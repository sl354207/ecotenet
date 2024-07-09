import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

export const HomepageContext = createContext();

export const useHomepageContext = () => useContext(HomepageContext);

export const HomepageProvider = ({ children }) => {
  const router = useRouter();
  const [ecoFilter, setEcoFilter] = useState();
  const [visited, setVisited] = useState();
  const [tab, setTab] = useState({ id: 0, label: "Ecoregions" });

  const [filterOpen, setFilterOpen] = useState(false);

  const [ecoOpen, setEcoOpen] = useState(false);

  const [FS, setFS] = useState({ state: undefined, item: undefined });
  const [FSOpen, setFSOpen] = useState(false);

  // use useEffect to interact with (external sources)  session storage in browser. Set session storage variable to ecoregion whenever an ecoregion is visited. Keep this variable in storage until another ecoregion is visited and reset. Set this variable to state so that categories can be filtered to specific ecoregion. Filter will only be shown if ecoregion is visited and session storage variable is set.
  useEffect(() => {
    let ecoregion = sessionStorage.getItem("ecoregion");

    setEcoFilter(JSON.parse(ecoregion));
  }, [router.pathname]);

  useEffect(() => {
    let visitedHome = localStorage.getItem("visited");

    if (router.pathname === "/") {
      localStorage.setItem("visited", true);
      setVisited(visitedHome);
    } else {
      setVisited(visitedHome);
    }
  }, [router.pathname]);

  const [ecoChips, setEcoChips] = useState([]);

  const [native, setNative] = useState({});

  return (
    <HomepageContext.Provider
      value={{
        ecoFilter,
        setEcoFilter,
        visited,
        setVisited,
        tab,
        setTab,
        filterOpen,
        setFilterOpen,
        ecoOpen,
        setEcoOpen,
        FS,
        setFS,
        FSOpen,
        setFSOpen,
        ecoChips,
        setEcoChips,
        native,
        setNative,
      }}
    >
      {children}
    </HomepageContext.Provider>
  );
};

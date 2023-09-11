import React, { createContext, useContext, useEffect, useState } from "react";
import { addChild_api, addHelmet, getHelmets, removeHelmet } from "./api";

// allHelmets, add, remove, current

interface Helmet {
  id: string;
}

interface HelmetTypes {
  add: (arg0: Helmet) => void;
  remove: (arg0: Helmet) => void;
  helmet: Helmet | null;
  allHelmets: Helmet[];
  addChild: ({
    first_name,
    last_name,
    age,
    helmet_id,
  }: {
    first_name: string;
    last_name: string;
    age: number;
    helmet_id: string;
  }) => void;
}

const HelmetsContext = createContext<HelmetTypes | undefined>(undefined);

export function useHelmets() {
  const context = useContext(HelmetsContext);
  if (!context) {
    throw new Error("useHelmets must be used within an HelmetsProvider");
  }
  return context;
}

interface HelmetsProviderProps {
  children: React.ReactNode;
  user: any;
}

export function HelmetsProvider({ user, children }: HelmetsProviderProps) {
  const [allHelmets, setAllHelmets] = useState<Helmet[]>([]);
  const [helmet, setHelmet] = useState<Helmet | null>(null);

  function add({ id }: Helmet) {
    if (id) {
      addHelmet({ id }).then(({ data }: { data: any }) => {
        setAllHelmets((prev) => [...prev, data.helmet]);
        setHelmet(data.helmet);
      });
    }
  }

  function addChild({
    first_name,
    last_name,
    age,
    helmet_id,
  }: {
    first_name: string;
    last_name: string;
    age: number;
    helmet_id: string;
  }) {
    addChild_api({ first_name, age, helmet_id, last_name });
  }

  function remove({ id }: Helmet) {
    if (id) {
      removeHelmet({ id }).then(({ data }: { data: any }) => {
        setAllHelmets((prev) => prev.filter((helmet) => helmet.id != id));
      });
    }
  }

  useEffect(() => {
    if (user) {
      getHelmets().then(({ data }: { data: any }) => {
        setAllHelmets(data.helmets);
      });
    }
  }, [user]);

  const contextValue: HelmetTypes = {
    add,
    remove,
    allHelmets,
    helmet,
    addChild,
  };

  return (
    <HelmetsContext.Provider value={contextValue}>
      {children}
    </HelmetsContext.Provider>
  );
}

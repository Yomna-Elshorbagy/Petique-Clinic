import { useMemo, useState } from "react";

export const useClientSearch = (clients: any[]) => {
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;

    const q = search.toLowerCase();

    return clients.filter((client) => {
      return (
        client.userName?.toLowerCase().includes(q) ||
        client.email?.toLowerCase().includes(q) ||
        client.mobileNumber?.toLowerCase().includes(q)
      );
    });
  }, [clients, search]);

  return {
    search,
    setSearch,
    filteredClients,
  };
};

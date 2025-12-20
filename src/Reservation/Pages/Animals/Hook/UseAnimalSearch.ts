import { useState, useMemo } from "react";
import type { IPet } from "../../../../Interfaces/Ipet";

export function usePetSearch(pets: IPet[]) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return pets;

    return pets.filter((pet) =>
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.petOwner?.userName?.toLowerCase().includes(search.toLowerCase()) ||
      pet.petOwner?._id.toLowerCase().includes(search.toLowerCase())
    );
  }, [pets, search]);

  return { search, setSearch, filtered };
}

import { useState, useMemo } from "react";
import type { IUser } from "../../../../Interfaces/IUser";

export function useDoctorSearch(doctors: IUser[]) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return doctors;

        const lowerSearch = search.toLowerCase();
        return doctors.filter((doctor) =>
            doctor.userName.toLowerCase().includes(lowerSearch) ||
            doctor.email.toLowerCase().includes(lowerSearch) ||
            doctor._id.toLowerCase().includes(lowerSearch) 
        );
    }, [doctors, search]);

    return { search, setSearch, filtered };
}

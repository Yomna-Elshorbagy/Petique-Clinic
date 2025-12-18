/* ================= PET ================= */

export interface TotalPetsResponse {
  success: boolean;
  totalPets: number;
}

export interface PetsPerCategory {
  categoryId: string;
  categoryName: string;
  totalPets: number;
}

export interface PetsPerCategoryResponse {
  success: boolean;
  data: PetsPerCategory[];
}

export interface PetsPerUser {
  userId: string;
  userName: string;
  totalPets: number;
}

export interface PetsPerUserResponse {
  success: boolean;
  data: PetsPerUser[];
}

export interface AgeDistribution {
  _id: string | number; // bucket range
  totalPets: number;
}

export interface AgeDistributionResponse {
  success: boolean;
  data: AgeDistribution[];
}

/* ================= VACCINATION ================= */

export interface VaccinationStatus {
  _id: "scheduled" | "completed" | "overdue";
  total: number;
}

export interface VaccinationStatusResponse {
  success: boolean;
  data: VaccinationStatus[];
}

export interface UpcomingVaccination {
  _id: string;
  name: string;
  image?: { secure_url: string };
  vaccinationHistory: {
    nextDose: string;
    vaccine: {
      _id: string;
      name: string;
    };
  }[];
}

export interface UpcomingVaccinationResponse {
  success: boolean;
  data: UpcomingVaccination[];
}

/* ================= CATEGORY ================= */

export interface TopCategory {
  _id: string;
  categoryName: string;
  totalPets: number;
}

export interface TopCategoriesResponse {
  success: boolean;
  data: TopCategory[];
}

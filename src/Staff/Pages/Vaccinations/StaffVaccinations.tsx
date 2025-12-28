import { useState } from 'react';
import { useStaffVaccinationOverview } from '../../../Hooks/Staff/useStaff';
import VaccinationCard from './Components/VaccinationCard';
import Pagination from '../../Components/Pagination/Pagination';

export default function StaffVaccinations() {
  const { data: vaccinations, isLoading } = useStaffVaccinationOverview();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Client-side pagination logic
  // (Assuming API returns all records for now. If API becomes paginated, update here)
  const allRecords = Array.isArray(vaccinations) ? vaccinations : [];
  const totalPages = Math.ceil(allRecords.length / itemsPerPage);

  const currentRecords = allRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">Vaccinations</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage completed and upcoming vaccinations.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : allRecords.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentRecords.map((record: any, idx: number) => (
              <VaccinationCard key={`${record.petId}-${record.vaccineName}-${idx}`} record={record} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          No vaccination records found.
        </div>
      )}
    </div>
  );
}

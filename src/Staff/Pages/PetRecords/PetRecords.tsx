import VaccinationRecordsTable from './Components/VaccinationRecordsTable';

export default function PetRecords() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">Pet Records</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage and view pet vaccination history.</p>
        </div>
      </div>

      <VaccinationRecordsTable />
    </div>
  );
}

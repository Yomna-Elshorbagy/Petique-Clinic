import React from 'react';

export default function StaffApointments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#443935]">Appointments</h1>
          <p className="text-[#86654F]">Manage your upcoming appointments here.</p>
        </div>
        <button className="bg-[#C58D52] text-white px-4 py-2 rounded-xl hover:bg-[#b67e46] transition-colors">
          + New Appointment
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#A98868]/10 h-96 flex items-center justify-center text-[#86654F]/60">
        Appointment Calendar / List will go here.
      </div>
    </div>
  );
}

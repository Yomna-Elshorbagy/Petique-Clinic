import React from 'react'
import MonthlyRevenues from './MonthlyRevenues'

export default function Reports() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Reports & Analytics</h1>
      <MonthlyRevenues />
    </div>
  )
}

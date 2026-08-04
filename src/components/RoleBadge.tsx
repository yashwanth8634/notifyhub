import type { Role } from '../types';

export function RoleBadge({ role }: { role: Role }) {
  const colors = {
    super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
    principal: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    dean: 'bg-blue-100 text-blue-800 border-blue-200',
    hod: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    faculty: 'bg-teal-100 text-teal-800 border-teal-200',
    student: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const label = role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[role] || colors.student}`}>
      {label}
    </span>
  );
}

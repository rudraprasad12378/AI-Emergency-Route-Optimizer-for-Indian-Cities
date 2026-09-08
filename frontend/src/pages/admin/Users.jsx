import React, { useState } from 'react';
import { mockUsers } from '../../mock/users';
import { PageContainer } from '../../components/layout/PageContainer';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { UserPlus, CheckCircle2 } from 'lucide-react';

export const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'driver',
    department: 'Emergency Medical Services (EMS)',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const columns = [
    { header: 'Full Name', key: 'name' },
    { header: 'Email / ID', key: 'email' },
    {
      header: 'Role',
      key: 'role',
      render: (u) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-950/60 text-primary-300 border border-primary-800/40">
          {u.role}
        </span>
      ),
    },
    { header: 'Department', key: 'department' },
  ];

  const handleAddUser = () => {
    if (!formData.name || !formData.email) return;
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      ...formData,
      status: 'active',
    };
    setUsers([newUser, ...users]);
    setIsAddOpen(false);
    setFormData({ name: '', email: '', role: 'driver', department: 'Emergency Medical Services (EMS)' });
    setSuccessMsg(`Officer ${newUser.name} added successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <PageContainer
      title="User & Access Management"
      subtitle="Authorized operators, triage dispatchers, and system administrators"
      actions={
        <Button size="sm" variant="primary" onClick={() => setIsAddOpen(true)}>
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add Officer
        </Button>
      }
    >
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs text-emerald-300 font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <Table columns={columns} data={users} />

      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddUser}
        title="Add Emergency Officer / Personnel"
        confirmLabel="Create Officer Account"
      >
        <div className="space-y-3 pt-2">
          <Input
            label="Full Name"
            placeholder="e.g. Inspector Bimal Jena"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. bimal.jena@bhubaneswar.gov.in"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Select
            label="System Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { label: 'Ambulance Driver', value: 'driver' },
              { label: 'Control Center Dispatcher', value: 'dispatcher' },
              { label: 'Hospital Triage Lead', value: 'hospital' },
              { label: 'System Administrator', value: 'admin' },
            ]}
          />
          <Input
            label="Department / Unit"
            placeholder="e.g. Odisha Fire & Emergency Services"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
      </Dialog>
    </PageContainer>
  );
};

export default Users;

import React from 'react';
import { mockUsers } from '../../mock/users';
import { PageContainer } from '../../components/layout/PageContainer';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { UserPlus } from 'lucide-react';

export const Users = () => {
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

  return (
    <PageContainer
      title="User & Access Management"
      subtitle="Authorized operators, triage dispatchers, and system administrators"
      actions={
        <Button size="sm" variant="primary">
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add Officer
        </Button>
      }
    >
      <Table columns={columns} data={mockUsers} />
    </PageContainer>
  );
};

export default Users;

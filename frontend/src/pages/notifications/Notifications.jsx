import React from 'react';
import { PageContainer } from '../../components/layout/PageContainer';
import { NotificationCenter } from '../../components/notifications/NotificationCenter';

export const Notifications = () => {
  return (
    <PageContainer
      title="Alerts & Dispatch Notifications"
      subtitle="Full operational log of dynamic reroutes, signal synchronizations, and system broadcasts"
    >
      <div className="max-w-4xl mx-auto">
        <NotificationCenter />
      </div>
    </PageContainer>
  );
};

export default Notifications;

import React from 'react';
import { mockAnalytics } from '../../mock/analytics';
import { PageContainer } from '../../components/layout/PageContainer';
import { KPICard } from '../../components/analytics/KPICard';
import { ResponseTimeChart } from '../../components/analytics/ResponseTimeChart';
import { IncidentChart } from '../../components/analytics/IncidentChart';
import { RoutePerformanceChart } from '../../components/analytics/RoutePerformanceChart';
import { TrafficChart } from '../../components/analytics/TrafficChart';
import { Table } from '../../components/ui/Table';
import { Siren, Clock, Zap, ShieldCheck } from 'lucide-react';

export const Analytics = () => {
  const { overview, responseTimeTrends, emergencyTypeBreakdown, hospitalStats } = mockAnalytics;

  const hospitalColumns = [
    { header: 'Hospital Center', key: 'name' },
    { header: 'Admissions Today', key: 'admissionsToday', align: 'center' },
    { header: 'Avg Transit (Mins)', key: 'avgTransitMin', align: 'right' },
    {
      header: 'Status',
      key: 'status',
      align: 'right',
      render: (item) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          item.status === 'High Load' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
        }`}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Performance Analytics & Reporting"
      subtitle="Operational telemetry, response time optimization, and hospital trauma load"
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            title="Avg Response Time"
            value={overview.avgResponseTimeMin}
            unit="mins"
            change="4.6m faster"
            isPositive={true}
            icon={Clock}
          />
          <KPICard
            title="Time Saved per Transit"
            value={overview.avgTimeSavedMin}
            unit="mins"
            change="+6.8m saved"
            isPositive={true}
            icon={Zap}
          />
          <KPICard
            title="Total Dispatches"
            value={overview.totalDispatchesToday}
            unit="missions"
            change="94.2% on target"
            isPositive={true}
            icon={Siren}
          />
          <KPICard
            title="Corridor Compliance"
            value={overview.complianceRate}
            unit="%"
            change="Target: >90%"
            isPositive={true}
            icon={ShieldCheck}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponseTimeChart data={responseTimeTrends} />
          <IncidentChart data={emergencyTypeBreakdown} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RoutePerformanceChart />
          <TrafficChart />
        </div>

        {/* Hospital Intake Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Emergency Receiving Hospital Load Summary
          </h3>
          <Table columns={hospitalColumns} data={hospitalStats} />
        </div>
      </div>
    </PageContainer>
  );
};

export default Analytics;

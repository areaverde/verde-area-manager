
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Bed, DollarSign, Wrench, User, Calendar, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format, addMonths, isAfter, isBefore } from "date-fns";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  loading?: boolean;
  className?: string;
}

function StatCard({ title, value, description, icon, loading = false, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center text-green-700">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            value
          )}
        </div>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUnits: 0,
    occupiedUnits: 0,
    availableUnits: 0,
    upcomingCheckins: 0,
    upcomingCheckouts: 0,
    pendingPayments: 0,
    maintenanceNeeded: 0,
    totalGuests: 0, 
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get current date
        const today = new Date();
        const inThirtyDays = addMonths(today, 1);
        const todayStr = format(today, 'yyyy-MM-dd');
        const inThirtyDaysStr = format(inThirtyDays, 'yyyy-MM-dd');
        
        // Fetch various stats in parallel
        const [
          totalUnitsResponse,
          occupiedUnitsResponse,
          availableUnitsResponse,
          upcomingCheckinsResponse,
          activeStaysResponse,
          pendingPaymentsResponse,
          maintenanceResponse,
          allGuestsResponse,
          allEmployeesResponse
        ] = await Promise.all([
          // Total Units
          supabase.from('units').select('*', { count: 'exact', head: true }),
          
          // Occupied Units
          supabase.from('units').select('*', { count: 'exact', head: true })
            .eq('status', 'occupied'),
          
          // Available Units
          supabase.from('units').select('*', { count: 'exact', head: true })
            .eq('status', 'available'),
          
          // Upcoming Check-ins
          supabase.from('stays').select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .gt('start_date', todayStr)
            .lt('start_date', inThirtyDaysStr),
          
          // Active Stays (to check for upcoming checkouts)
          supabase.from('stays').select('id, end_date')
            .eq('status', 'active')
            .not('end_date', 'is', null),
          
          // Pending Payments
          supabase.from('payments').select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),
          
          // Maintenance Needed
          supabase.from('maintenance_logs').select('*', { count: 'exact', head: true })
            .in('status', ['reported', 'scheduled', 'in_progress']),
            
          // Total Guests
          supabase.from('guests').select('*', { count: 'exact', head: true }),
          
          // Total Employees
          supabase.from('employees').select('*', { count: 'exact', head: true })
            .is('end_date', null), // Only active employees
        ]);

        // Calculate upcoming checkouts
        let upcomingCheckouts = 0;
        if (activeStaysResponse.data) {
          upcomingCheckouts = activeStaysResponse.data.filter(stay => {
            if (!stay.end_date) return false;
            const endDate = new Date(stay.end_date);
            return isAfter(endDate, today) && isBefore(endDate, inThirtyDays);
          }).length;
        }

        setStats({
          totalUnits: totalUnitsResponse.count || 0,
          occupiedUnits: occupiedUnitsResponse.count || 0,
          availableUnits: availableUnitsResponse.count || 0,
          upcomingCheckins: upcomingCheckinsResponse.count || 0,
          upcomingCheckouts,
          pendingPayments: pendingPaymentsResponse.count || 0,
          maintenanceNeeded: maintenanceResponse.count || 0,
          totalGuests: allGuestsResponse.count || 0,
          totalEmployees: allEmployeesResponse.count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Unidades Ocupadas"
          value={`${stats.occupiedUnits} / ${stats.totalUnits}`}
          description="Total de unidades ocupadas"
          icon={<Building size={18} />}
          loading={loading}
          className="border-l-4 border-green-500"
        />
        <StatCard
          title="Unidades Disponíveis"
          value={stats.availableUnits}
          description="Unidades prontas para ocupação"
          icon={<Building size={18} />}
          loading={loading}
          className="border-l-4 border-blue-500"
        />
        <StatCard
          title="Check-ins Próximos"
          value={stats.upcomingCheckins}
          description="Nos próximos 30 dias"
          icon={<Calendar size={18} />}
          loading={loading}
          className="border-l-4 border-purple-500"
        />
        <StatCard
          title="Check-outs Próximos"
          value={stats.upcomingCheckouts}
          description="Nos próximos 30 dias"
          icon={<Calendar size={18} />}
          loading={loading}
          className="border-l-4 border-orange-500"
        />
        <StatCard
          title="Pagamentos Pendentes"
          value={stats.pendingPayments}
          description="Aguardando confirmação"
          icon={<DollarSign size={18} />}
          loading={loading}
          className="border-l-4 border-yellow-500"
        />
        <StatCard
          title="Manutenções Ativas"
          value={stats.maintenanceNeeded}
          description="Reportadas ou em andamento"
          icon={<AlertTriangle size={18} />}
          loading={loading}
          className="border-l-4 border-red-500"
        />
        <StatCard
          title="Hóspedes"
          value={stats.totalGuests}
          description="Total de hóspedes registrados"
          icon={<Users size={18} />}
          loading={loading}
          className="border-l-4 border-indigo-500"
        />
        <StatCard
          title="Funcionários Ativos"
          value={stats.totalEmployees}
          description="Equipe atual"
          icon={<User size={18} />}
          loading={loading}
          className="border-l-4 border-teal-500"
        />
        <StatCard
          title="Taxa de Ocupação"
          value={`${stats.totalUnits ? Math.round((stats.occupiedUnits / stats.totalUnits) * 100) : 0}%`}
          description="Porcentagem de unidades ocupadas"
          icon={<Bed size={18} />}
          loading={loading}
          className="border-l-4 border-pink-500"
        />
      </div>
    </div>
  );
}

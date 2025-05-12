
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Bed, DollarSign, Wrench, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  loading?: boolean;
}

function StatCard({ title, value, description, icon, loading = false }: StatCardProps) {
  return (
    <Card>
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
    unidades: 0,
    hospedes: 0,
    estadias: 0,
    pagamentos: 0,
    manutencao: 0,
    funcionarios: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          unidadesResponse,
          hospedesResponse,
          estadiasResponse,
          pagamentosResponse,
          manutencaoResponse,
          funcionariosResponse
        ] = await Promise.all([
          supabase.from('units').select('*', { count: 'exact', head: true }),
          supabase.from('guests').select('*', { count: 'exact', head: true }),
          supabase.from('stays').select('*', { count: 'exact', head: true }),
          supabase.from('payments').select('*', { count: 'exact', head: true }),
          supabase.from('maintenance_logs').select('*', { count: 'exact', head: true }),
          supabase.from('employees').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          unidades: unidadesResponse.count || 0,
          hospedes: hospedesResponse.count || 0,
          estadias: estadiasResponse.count || 0,
          pagamentos: pagamentosResponse.count || 0,
          manutencao: manutencaoResponse.count || 0,
          funcionarios: funcionariosResponse.count || 0,
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
          title="Unidades"
          value={stats.unidades}
          icon={<Building size={18} />}
          loading={loading}
        />
        <StatCard
          title="Hóspedes"
          value={stats.hospedes}
          icon={<Users size={18} />}
          loading={loading}
        />
        <StatCard
          title="Estadias Ativas"
          value={stats.estadias}
          icon={<Bed size={18} />}
          loading={loading}
        />
        <StatCard
          title="Pagamentos"
          value={stats.pagamentos}
          description="Total de pagamentos registrados"
          icon={<DollarSign size={18} />}
          loading={loading}
        />
        <StatCard
          title="Manutenções"
          value={stats.manutencao}
          icon={<Wrench size={18} />}
          loading={loading}
        />
        <StatCard
          title="Funcionários"
          value={stats.funcionarios}
          icon={<User size={18} />}
          loading={loading}
        />
      </div>
    </div>
  );
}

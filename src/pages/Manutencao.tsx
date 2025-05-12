
import { MaintenanceTabs } from "@/components/maintenance/Tabs";

export default function Manutencao() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manutenção</h1>
      </div>
      
      <MaintenanceTabs />
    </div>
  );
}

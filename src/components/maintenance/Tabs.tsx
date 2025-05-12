
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemList } from "./ItemList";
import { MaintenanceLogList } from "./MaintenanceLogList";
import { ItemDialog } from "./ItemDialog";
import { MaintenanceLogDialog } from "./MaintenanceLogDialog";
import { Button } from "@/components/ui/button";
import { Wrench, Package } from "lucide-react";

interface Item {
  id: string;
  unit_id: string;
  name: string;
  type: string;
  brand: string | null;
  model: string | null;
  purchase_date: string | null;
  condition: string;
  notes: string | null;
}

interface MaintenanceLog {
  id: string;
  unit_id: string;
  item_id: string | null;
  description: string;
  date_reported: string;
  date_completed: string | null;
  cost: number | null;
  service_provider: string | null;
  status: string;
  notes: string | null;
}

export function MaintenanceTabs() {
  const [itemDialogOpen, setItemDialogOpen] = React.useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [selectedMaintenanceLog, setSelectedMaintenanceLog] = React.useState<MaintenanceLog | null>(null);
  const [refreshItemsTrigger, setRefreshItemsTrigger] = React.useState(0);
  const [refreshMaintenanceTrigger, setRefreshMaintenanceTrigger] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("items");

  const handleCreateItem = () => {
    setSelectedItem(null);
    setItemDialogOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setItemDialogOpen(true);
  };

  const handleCreateMaintenance = () => {
    setSelectedMaintenanceLog(null);
    setMaintenanceDialogOpen(true);
  };

  const handleEditMaintenance = (maintenanceLog: MaintenanceLog) => {
    setSelectedMaintenanceLog(maintenanceLog);
    setMaintenanceDialogOpen(true);
  };

  return (
    <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package size={16} />
            <span>Itens</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench size={16} />
            <span>Logs de Manutenção</span>
          </TabsTrigger>
        </TabsList>

        {activeTab === "items" ? (
          <Button 
            className="bg-green-700 hover:bg-green-800"
            onClick={handleCreateItem}
          >
            Adicionar Item
          </Button>
        ) : (
          <Button 
            className="bg-green-700 hover:bg-green-800"
            onClick={handleCreateMaintenance}
          >
            Registrar Manutenção
          </Button>
        )}
      </div>

      <TabsContent value="items">
        <ItemList 
          key={refreshItemsTrigger} 
          onEdit={handleEditItem} 
        />
        <ItemDialog
          open={itemDialogOpen}
          mode={selectedItem ? "edit" : "create"}
          initialData={selectedItem}
          onOpenChange={setItemDialogOpen}
          onSuccess={() => setRefreshItemsTrigger(prev => prev + 1)}
        />
      </TabsContent>

      <TabsContent value="maintenance">
        <MaintenanceLogList 
          key={refreshMaintenanceTrigger} 
          onEdit={handleEditMaintenance} 
        />
        <MaintenanceLogDialog
          open={maintenanceDialogOpen}
          mode={selectedMaintenanceLog ? "edit" : "create"}
          initialData={selectedMaintenanceLog}
          onOpenChange={setMaintenanceDialogOpen}
          onSuccess={() => setRefreshMaintenanceTrigger(prev => prev + 1)}
        />
      </TabsContent>
    </Tabs>
  );
}

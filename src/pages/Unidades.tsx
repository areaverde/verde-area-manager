
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import UnitForm from "@/components/units/UnitForm";
import UnitDetails from "@/components/units/UnitDetails";
import { useAuth } from "@/context/AuthContext";
import UnitList from "@/components/units/UnitList";
import UnitEmptyState from "@/components/units/UnitEmptyState";

type Unit = {
  id: string;
  unit_number: string;
  description: string | null;
  status: 'available' | 'occupied' | 'maintenance' | 'inactive';
  address: {
    id: string;
    name: string;
    street: string;
    number: string;
    city: string;
  } | null;
};

export default function Unidades() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchUnits();
  }, []);

  async function fetchUnits() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('units')
        .select(`
          id, 
          unit_number, 
          description, 
          status,
          address:address_id (
            id,
            name,
            street,
            number,
            city
          )
        `)
        .order('unit_number', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setUnits(data || []);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast({
        title: "Erro ao carregar unidades",
        description: "Ocorreu um problema ao carregar as unidades. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleAddUnit() {
    setSelectedUnit(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  }

  function handleEditUnit(unit: Unit) {
    setSelectedUnit(unit);
    setDialogMode('edit');
    setIsDialogOpen(true);
  }

  function handleViewUnit(unit: Unit) {
    setSelectedUnit(unit);
    setDialogMode('view');
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    fetchUnits(); // Refresh the data
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Unidades</h1>
        <Button 
          className="bg-green-700 hover:bg-green-800 flex items-center gap-2"
          onClick={handleAddUnit}
        >
          <Plus size={16} />
          Nova Unidade
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Lista de Unidades</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            </div>
          ) : units.length > 0 ? (
            <UnitList 
              units={units}
              onViewUnit={handleViewUnit}
              onEditUnit={handleEditUnit}
            />
          ) : (
            <UnitEmptyState onAddUnit={handleAddUnit} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {dialogMode === 'view' && selectedUnit && (
            <UnitDetails unit={selectedUnit} onClose={handleDialogClose} />
          )}
          
          {(dialogMode === 'create' || dialogMode === 'edit') && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {dialogMode === 'create' ? 'Adicionar Nova Unidade' : 'Editar Unidade'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da unidade abaixo. Todos os campos marcados com * são obrigatórios.
                </DialogDescription>
              </DialogHeader>
              <UnitForm 
                unit={selectedUnit} 
                userId={user?.id || ''} 
                mode={dialogMode}
                onSuccess={handleDialogClose}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

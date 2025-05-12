
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Building, Pencil, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UnitForm from "@/components/units/UnitForm";
import UnitDetails from "@/components/units/UnitDetails";
import { useAuth } from "@/context/AuthContext";

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
  const navigate = useNavigate();
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

  function getStatusBadge(status: string) {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Disponível</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Ocupada</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Manutenção</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Inativa</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
            <div className="overflow-x-auto">
              <Table className="border-collapse border border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Número da Unidade</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.unit_number}</TableCell>
                      <TableCell>
                        {unit.address ? (
                          <>
                            {unit.address.name || `${unit.address.street}, ${unit.address.number}`}
                            <div className="text-xs text-gray-500">
                              {unit.address.city}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">Sem endereço</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(unit.status)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="inline-flex items-center gap-1"
                          onClick={() => handleViewUnit(unit)}
                        >
                          <Eye size={14} />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="inline-flex items-center gap-1"
                          onClick={() => handleEditUnit(unit)}
                        >
                          <Pencil size={14} />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-100 p-3 inline-flex items-center justify-center rounded-full mb-4">
                <Building size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold">Nenhuma unidade encontrada</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-1 mb-4">
                Você ainda não possui unidades cadastradas. Adicione sua primeira unidade para começar.
              </p>
              <Button 
                className="bg-green-700 hover:bg-green-800"
                onClick={handleAddUnit}
              >
                Adicionar Unidade
              </Button>
            </div>
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

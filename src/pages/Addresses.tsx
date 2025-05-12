
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import AddressForm from "@/components/addresses/AddressForm";
import { useAuth } from "@/context/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type Address = {
  id: string;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
};

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Erro ao carregar endereços",
        description: "Ocorreu um problema ao carregar os endereços. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleAddAddress() {
    setSelectedAddress(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  }

  function handleEditAddress(address: Address) {
    setSelectedAddress(address);
    setDialogMode('edit');
    setIsDialogOpen(true);
  }

  async function handleDeleteAddress(id: string) {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Endereço removido",
        description: "O endereço foi removido com sucesso.",
      });
      
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Erro ao remover endereço",
        description: "Ocorreu um problema ao remover o endereço. Verifique se não há unidades associadas a ele.",
        variant: "destructive",
      });
    }
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    fetchAddresses(); // Refresh the data
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Endereços</h1>
        <Button 
          className="bg-green-700 hover:bg-green-800 flex items-center gap-2"
          onClick={handleAddAddress}
        >
          <Plus size={16} />
          Novo Endereço
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Lista de Endereços</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            </div>
          ) : addresses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="border-collapse border border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Cidade/Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addresses.map((address) => (
                    <TableRow key={address.id}>
                      <TableCell className="font-medium">{address.name}</TableCell>
                      <TableCell>{address.street}, {address.number}</TableCell>
                      <TableCell>{address.city}/{address.state}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="inline-flex items-center gap-1"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Pencil size={14} />
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.
                                <p className="mt-2 font-medium">{address.name} - {address.street}, {address.number}</p>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-100 p-3 inline-flex items-center justify-center rounded-full mb-4">
                <MapPin size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold">Nenhum endereço encontrado</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-1 mb-4">
                Você ainda não possui endereços cadastrados. Adicione seu primeiro endereço para começar.
              </p>
              <Button 
                className="bg-green-700 hover:bg-green-800"
                onClick={handleAddAddress}
              >
                Adicionar Endereço
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Adicionar Novo Endereço' : 'Editar Endereço'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do endereço abaixo. Todos os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          <AddressForm 
            address={selectedAddress} 
            userId={user?.id || ''} 
            mode={dialogMode}
            onSuccess={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

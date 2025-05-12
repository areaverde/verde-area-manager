
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Users, Pencil, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import GuestForm from "@/components/guests/GuestForm";
import GuestDetails from "@/components/guests/GuestDetails";
import { useAuth } from "@/context/AuthContext";

type Guest = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  document_id: string;
  notes: string | null;
};

export default function Hospedes() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchGuests();
  }, []);

  async function fetchGuests() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('guests')
        .select('id, full_name, phone, email, document_id, notes')
        .order('full_name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Erro ao carregar hóspedes",
        description: "Ocorreu um problema ao carregar os hóspedes. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleAddGuest() {
    setSelectedGuest(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  }

  function handleEditGuest(guest: Guest) {
    setSelectedGuest(guest);
    setDialogMode('edit');
    setIsDialogOpen(true);
  }

  function handleViewGuest(guest: Guest) {
    setSelectedGuest(guest);
    setDialogMode('view');
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
    fetchGuests(); // Refresh the data
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Hóspedes</h1>
        <Button 
          className="bg-green-700 hover:bg-green-800 flex items-center gap-2"
          onClick={handleAddGuest}
        >
          <Plus size={16} />
          Novo Hóspede
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Lista de Hóspedes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            </div>
          ) : guests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="border-collapse border border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.full_name}</TableCell>
                      <TableCell>{guest.phone}</TableCell>
                      <TableCell>{guest.email}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="inline-flex items-center gap-1"
                          onClick={() => handleViewGuest(guest)}
                        >
                          <Eye size={14} />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="inline-flex items-center gap-1"
                          onClick={() => handleEditGuest(guest)}
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
                <Users size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold">Nenhum hóspede encontrado</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-1 mb-4">
                Você ainda não possui hóspedes cadastrados. Adicione seu primeiro hóspede para começar.
              </p>
              <Button 
                className="bg-green-700 hover:bg-green-800"
                onClick={handleAddGuest}
              >
                Adicionar Hóspede
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {dialogMode === 'view' && selectedGuest && (
            <GuestDetails guest={selectedGuest} onClose={handleDialogClose} />
          )}
          
          {(dialogMode === 'create' || dialogMode === 'edit') && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {dialogMode === 'create' ? 'Adicionar Novo Hóspede' : 'Editar Hóspede'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do hóspede abaixo. Todos os campos marcados com * são obrigatórios.
                </DialogDescription>
              </DialogHeader>
              <GuestForm 
                guest={selectedGuest} 
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


import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Hospedes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Hóspedes</h1>
        <Button className="bg-green-700 hover:bg-green-800">
          Novo Hóspede
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Carlos Silva</h3>
              <p className="text-sm text-gray-500">carlos.silva@email.com</p>
              <p className="text-sm text-gray-500">(11) 98765-4321</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-green-700" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

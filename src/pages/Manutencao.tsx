
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function Manutencao() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manutenção</h1>
        <Button className="bg-green-700 hover:bg-green-800">
          Nova Manutenção
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Reparo Ar Condicionado</h3>
              <p className="text-sm text-gray-500">Casa 101</p>
              <p className="text-sm text-gray-500">Reportado: 05/05/2025</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Wrench className="h-5 w-5 text-green-700" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 border-yellow-200">
              Pendente
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

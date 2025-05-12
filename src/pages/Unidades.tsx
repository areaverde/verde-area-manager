
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function Unidades() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Unidades</h1>
        <Button className="bg-green-700 hover:bg-green-800">
          Nova Unidade
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Casa 101</h3>
              <p className="text-sm text-gray-500">Rua das Flores, 123</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Building className="h-5 w-5 text-green-700" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-green-200">
              Ocupado
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

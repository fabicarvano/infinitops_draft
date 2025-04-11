import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="bg-red-50 p-3 rounded-full mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Não foi possível encontrar a página solicitada. Verifique o endereço ou
        retorne para o painel principal.
      </p>
      <Link href="/">
        <Button className="bg-green-700 hover:bg-green-800">
          Voltar para o início
        </Button>
      </Link>
    </div>
  );
}
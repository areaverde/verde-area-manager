
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface FormSubmissionOptions {
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  errorDescription: string;
  onSuccess: () => void;
}

/**
 * A shared hook for handling form submissions with common toast notifications
 * and loading state management
 */
export function useFormSubmission({ 
  successTitle, 
  successDescription, 
  errorTitle, 
  errorDescription,
  onSuccess 
}: FormSubmissionOptions) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;

  const handleSubmit = async <T,>(submitFn: (userId: string, data: T) => Promise<void>, data: T) => {
    if (!userId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await submitFn(userId, data);
      
      toast({
        title: successTitle,
        description: successDescription,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit,
    userId
  };
}

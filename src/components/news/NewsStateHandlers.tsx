
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  isLoading: boolean;
}

export const LoadingState = ({ isLoading }: LoadingStateProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

interface ErrorStateProps {
  error: Error | null;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  if (!error) return null;
  
  const isApiKeyError = error.message && (
    error.message.includes('API key') || 
    error.message.includes('unauthorized') || 
    error.message.includes('Unauthorized')
  );
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p>Failed to load news. {error.message}</p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs bg-red-50/10 p-2 rounded overflow-auto max-h-32">
              {error.stack}
            </pre>
          )}
          
          {isApiKeyError && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">This appears to be an API key issue.</p>
              <Link to="/admin/api-keys">
                <Button size="sm" variant="outline">
                  Go to API Keys Management
                </Button>
              </Link>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

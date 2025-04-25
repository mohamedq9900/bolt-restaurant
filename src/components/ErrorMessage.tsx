import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <AlertTriangle className="h-8 w-8 text-accent-500 mb-2" />
      <p className="text-accent-600 mb-2">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn btn-primary mt-2"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
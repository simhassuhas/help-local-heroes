
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ResourceRequestForm from '@/components/ResourceRequestForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const NewRequestPage = () => {
  const navigate = useNavigate();
  
  const handleSubmitComplete = () => {
    // Navigate back to the requests page after submission
    setTimeout(() => {
      navigate('/requests');
    }, 1000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Emergency Resource Request</AlertTitle>
          <AlertDescription>
            This form is for emergency situations only. If you need immediate life-saving assistance, please call emergency services directly.
          </AlertDescription>
        </Alert>
        
        <div className="bg-card shadow-lg rounded-lg border border-muted p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Request Emergency Resources</h1>
          <ResourceRequestForm onSubmitComplete={handleSubmitComplete} />
        </div>
      </div>
    </Layout>
  );
};

export default NewRequestPage;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ResourceRequestForm from '@/components/ResourceRequestForm';

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Request Resources</h1>
        <ResourceRequestForm onSubmitComplete={handleSubmitComplete} />
      </div>
    </Layout>
  );
};

export default NewRequestPage;

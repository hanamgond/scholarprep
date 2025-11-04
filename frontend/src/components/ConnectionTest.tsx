// frontend/src/components/ConnectionTest.tsx
import React, { useEffect, useState } from 'react';
import { healthService } from '../services/api/health';

export const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await healthService.checkHealth();
        setStatus('success');
        setMessage(`Backend connected: ${result.status} at ${result.ts}`);
      } catch (error: unknown) {
        setStatus('error');
        if (error instanceof Error) {
          setMessage(`Connection failed: ${error.message}`);
        } else {
          setMessage('Connection failed: Unknown error');
        }
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ 
      padding: '12px', 
      margin: '0',
      border: `2px solid ${status === 'success' ? 'green' : status === 'error' ? 'red' : 'orange'}`,
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontSize: '14px'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
        Backend Connection
      </h4>
      <p style={{ margin: '4px 0', fontSize: '12px' }}>
        <strong>Status:</strong> {status}
      </p>
      <p style={{ margin: '4px 0', fontSize: '12px' }}>
        {message}
      </p>
    </div>
  );
};
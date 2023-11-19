import React, { createRef, useState } from 'react';
import UnlockPDFAssemble from '@/app/components/Assemble/UnlockPDF';
import axios from 'axios';
import { Handler } from '@/app/components/Assemble/UnlockPDF/types';

const UnlockPDF = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const formRef = createRef<Handler>();

  const handleSubmit = async (file: File, password: string) => {
    if (!file || password === '') return;
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: `https://tanraksit-pdf-service.onrender.com/api/unlock-pdf`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: { file, password },
        onUploadProgress: ({ progress }) => {
          if (!progress) return;
          console.log((progress * 100).toFixed(2));
        },
        responseType: 'blob',
      });

      // download automatically
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `unlocked-${file.name}`);

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);

      formRef.current?.onReset();
    } catch (error) {
      console.error(error);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <UnlockPDFAssemble
      ref={formRef}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      error={error}
    />
  );
};

export default UnlockPDF;

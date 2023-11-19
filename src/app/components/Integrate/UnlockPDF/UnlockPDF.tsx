import React, { Ref, useRef, useState } from 'react';
import UnlockPDFAssemble from '@/app/components/Assemble/UnlockPDF';
import axios from 'axios';
import { Handler } from '../../Assemble/UnlockPDF/types';

const UnlockPDF = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const formRef = useRef<Handler>(null);

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
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      autoDownloadFile(blob, file.name);
      formRef.current?.onReset();
    } catch (error) {
      console.error(error);
      setError(true);
    }
    setLoading(false);
  };

  const autoDownloadFile = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `unlocked-${fileName}`);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
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

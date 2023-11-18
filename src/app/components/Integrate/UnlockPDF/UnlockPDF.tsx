import React from 'react';
import UnlockPDFAssemble from '@/app/components/Assemble/UnlockPDF';
import axios from 'axios';

const UnlockPDF = () => {
  const handleSubmit = async (file: File, password: string) => {
    if (!file || password === '') return;

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

      //TODO: add function clear file after unlock file done
    } catch (error) {
      console.error(error);
    }
  };

  return <UnlockPDFAssemble onSubmit={handleSubmit} />;
};

export default UnlockPDF;

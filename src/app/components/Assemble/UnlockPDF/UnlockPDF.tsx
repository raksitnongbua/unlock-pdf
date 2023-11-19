import React, {
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { Handler, Props } from './types';
import UnlockPDFForm from '@/app/components/Combine/UnlockPDFForm';

const UnlockPDF = forwardRef<Handler, Props>((props, ref) => {
  const { onSubmit, isLoading } = props;
  const [password, setPassword] = useState('');
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onSubmit?.(acceptedFiles[0], password);

    event.preventDefault();
  };

  useImperativeHandle(ref, () => ({
    onReset: () => {
      acceptedFiles.length = 0;
      console.log(
        '🚀 ~ file: UnlockPdf.tsx:29 ~ useImperativeHandle ~ acceptedFiles:',
        acceptedFiles
      );
      acceptedFiles.splice(0, acceptedFiles.length);
      setPassword('');
    },
  }));

  return (
    <UnlockPDFForm
      acceptedFiles={acceptedFiles}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isLoading={isLoading}
      onPasswordChange={(e) => setPassword(e.target.value)}
      password={password}
      onSubmit={handleSubmit}
    />
  );
});

UnlockPDF.displayName = 'UnlockPDF';

export default UnlockPDF;

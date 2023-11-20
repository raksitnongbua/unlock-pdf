import React, {
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { Handler, Props } from './types';
import UnlockPDFForm from '@/app/components/Combine/UnlockPDFForm';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const UnlockPDF = forwardRef<Handler, Props>((props, ref) => {
  const { onSubmit, isLoading } = props;
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [requiredPassword, setRequiredPassword] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
    onDrop(acceptedFiles) {
      setError(undefined);
      setRequiredPassword(false);
      checkFileIsEncrypted(acceptedFiles[0]);
    },
  });

  const checkFileIsEncrypted = (file: File) => {
    loadFilePDF(file, async (event) => {
      const fileData = event?.target?.result;
      if (fileData) {
        const pdfDocument = pdfjs.getDocument({
          data: fileData,
        });

        try {
          const pdfContent = await pdfDocument.promise;
          await pdfContent.getData();
          setRequiredPassword(false);
        } catch (error: any) {
          if (error.name === 'PasswordException') {
            if (error.code === 1) {
              setRequiredPassword(true);
            }
          } else {
            setError('Something went wrong, Please try again');
          }
        }
      }
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setError(undefined);
    validatePassword(acceptedFiles[0], password);
    event.preventDefault();
  };

  const submit = () => {
    onSubmit?.(acceptedFiles[0], password);
  };

  const loadFilePDF = (
    file: File,
    callback: (event: ProgressEvent<FileReader>) => void
  ) => {
    if (file.type !== 'application/pdf') {
      return '';
    }
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      callback(event);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const validatePassword = (file: File, pw: string) => {
    setIsValidating(true);
    loadFilePDF(file, async (event) => {
      const fileData = event?.target?.result;
      if (fileData) {
        const pdfDocument = pdfjs.getDocument({
          data: fileData,
          password: pw,
        });

        try {
          const pdfContent = await pdfDocument.promise;
          await pdfContent.getData();

          submit();
        } catch (error: any) {
          if (error.name === 'PasswordException') {
            if (error.code === 1) {
              setError('Required password');
            } else if (error.code === 2) {
              setError('Incorrect password');
            }
          } else {
            setError('Something went wrong, Please try again');
          }
        } finally {
          setIsValidating(false);
        }
      }
    });
  };

  useImperativeHandle(ref, () => ({
    onReset: () => {
      acceptedFiles.length = 0;
      acceptedFiles.splice(0, acceptedFiles.length);
      setPassword('');
      setRequiredPassword(false);
    },
  }));

  return (
    <UnlockPDFForm
      acceptedFiles={acceptedFiles}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isLoading={isLoading || isValidating}
      onPasswordChange={(e) => setPassword(e.target.value)}
      password={password}
      onSubmit={handleSubmit}
      error={error}
      requiredPassword={requiredPassword}
    />
  );
});

UnlockPDF.displayName = 'UnlockPDF';

export default UnlockPDF;

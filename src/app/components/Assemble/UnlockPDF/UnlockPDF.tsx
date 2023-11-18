import React, { FormEvent, Ref, forwardRef, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Props } from './types';

const UnlockPDF = (props: Props) => {
  const { onSubmit } = props;
  const [password, setPassword] = useState('');
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  const resetFiles = () => {
    acceptedFiles.slice(0, 1);
    console.log(acceptedFiles);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    onSubmit?.(acceptedFiles[0], password);
    event.preventDefault();
  };

  const files = useMemo(
    () =>
      acceptedFiles.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      )),
    [acceptedFiles]
  );

  return (
    <div className='container mx-auto mt-10'>
      <h2 className='text-2xl font-bold mb-5'>Unlock PDF</h2>

      <form onSubmit={handleSubmit}>
        <div className='mb-5'>
          <label className='block mb-2'>Select PDF File</label>
          <div
            {...getRootProps({
              className:
                'dropzone outline-dashed py-8 px-4 outline-white rounded-lg',
            })}
          >
            <input {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
          </div>
        </div>
        <aside>
          <ul>{files}</ul>
        </aside>
        {files.length > 0 && (
          <div className='mb-5 mt-2'>
            <label className='block mb-2'>Enter Password</label>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='text-black p-1'
              placeholder='password'
            />
          </div>
        )}

        <button
          type='submit'
          className='btn btn-primary bg-green-500 uppercase p-4 rounded-lg'
        >
          Unlock
        </button>
      </form>
    </div>
  );
};

export default UnlockPDF;

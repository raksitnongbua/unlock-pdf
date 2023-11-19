import React from 'react';
import { Props } from './types';
import UnlockButton from '@/app/components/Build/UnlockButton';

const UnlockPDFForm = (props: Props) => {
  const {
    getInputProps,
    getRootProps,
    acceptedFiles,
    onSubmit,
    password,
    onPasswordChange,
    isLoading,
  } = props;

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <div className='container mx-auto mt-10'>
      <h2 className='text-2xl font-bold mb-5'>Unlock PDF</h2>

      <form onSubmit={onSubmit}>
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
              onChange={onPasswordChange}
              className='text-black p-1'
              placeholder='password'
            />
          </div>
        )}
        <UnlockButton isLoading={isLoading} />
      </form>
    </div>
  );
};

export default UnlockPDFForm;

import { ChangeEvent, FormEvent } from 'react';
import { DropzoneState } from 'react-dropzone';

export interface Props
  extends Pick<
    DropzoneState,
    'acceptedFiles' | 'getRootProps' | 'getInputProps'
  > {
  password: string;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  requiredPassword: boolean;
  error?: string;
}

export interface Props {
  isLoading: boolean;
  onSubmit?: (file: File, password: string) => void;
  error: boolean;
}
export interface Handler {
  onReset: () => void;
}

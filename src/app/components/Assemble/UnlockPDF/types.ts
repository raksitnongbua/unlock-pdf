export interface Props {
  isLoading: boolean;
  onSubmit?: (file: File, password: string) => void;
}

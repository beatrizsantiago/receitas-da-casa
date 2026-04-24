export interface ApiErrorResponse {
  message?: string;
  validation_errors?: Record<string, string[]>;
}

export function getApiErrorMessage(err: unknown, fallback = 'Ocorreu um erro'): string {
  const axiosError = err as { response?: { data?: ApiErrorResponse } };
  const msg = axiosError?.response?.data?.message;
  if (Array.isArray(msg)) return msg[0];
  return msg ?? fallback;
}

export function getApiFieldErrors(err: unknown): Record<string, string[]> {
  const axiosError = err as { response?: { data?: ApiErrorResponse } };
  return axiosError?.response?.data?.validation_errors ?? {};
}

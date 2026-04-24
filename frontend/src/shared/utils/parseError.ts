export function getApiErrorMessage(err: unknown, fallback = 'Ocorreu um erro'): string {
  const axiosError = err as { response?: { data?: { message?: string } } };
  return axiosError?.response?.data?.message ?? fallback;
}

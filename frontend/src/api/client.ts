export interface ApiError {
  detail: string;
  status: number;
}

const getBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const token = localStorage.getItem('access_token');

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  // If request body is not FormData, default to JSON
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Inject bearer token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Global 401 interceptor
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }

      let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (typeof errorJson.detail === 'string') {
          errorDetail = errorJson.detail;
        } else if (Array.isArray(errorJson.detail)) {
          // Handle Pydantic 422 validation errors
          errorDetail = errorJson.detail.map((err: { loc?: string[]; msg?: string }) => 
            `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg || 'Invalid field'}`
          ).join(', ');
        }
      } catch {
        // Fallback to text error if JSON parsing fails
      }

      const error: ApiError = {
        detail: errorDetail,
        status: response.status,
      };
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  } catch (err: unknown) {
    if ((err as ApiError).status) {
      throw err;
    }
    // Network errors or fetch failures
    throw {
      detail: (err as Error).message || 'Network connection failed',
      status: 0,
    } as ApiError;
  }
}

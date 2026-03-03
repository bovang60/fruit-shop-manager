/**
 * Simple API Client
 * Call API with URL and request body
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ============= Types =============

export interface ApiResponse<T = any> {
  resultCd: number;
  message?: string;
  data: T | null;
}

// ============= API Client =============

/**
 * Call API method - Simple and straightforward
 * @param url - API endpoint (e.g., '/api/users/login')
 * @param requestDto - Request body object (optional)
 * @returns Response data from API
 *
 * @example
 * // POST request (có body)
 * const response = await callApi('/api/users/login', { email: 'test@example.com', password: '123456' })
 *
 * // GET request (không có body)
 * const users = await callApi('/api/users')
 */
export async function callApi<TRequest = any, TResponse = any>(
  url: string,
  requestDto?: TRequest,
): Promise<TResponse> {
  const method = requestDto ? "POST" : "GET";
  const fullUrl = `${API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: requestDto ? JSON.stringify(requestDto) : undefined,
    });

    const data = await response.json();

    return data as TResponse;
  } catch (error) {
    throw error;
  }
}

/**
 * Call API with specific HTTP method
 * @param method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param url - API endpoint
 * @param requestDto - Request body object (optional)
 * @returns Response data from API
 *
 * @example
 * // POST
 * const response = await callApiWithMethod('POST', '/api/users/login', { email: 'test@example.com', password: '123456' })
 *
 * // GET
 * const users = await callApiWithMethod('GET', '/api/users')
 *
 * // PUT
 * const updated = await callApiWithMethod('PUT', '/api/users/1', { name: 'John' })
 *
 * // DELETE
 * await callApiWithMethod('DELETE', '/api/users/1')
 */
export async function callApiWithMethod<TRequest = any, TResponse = any>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  requestDto?: TRequest,
): Promise<TResponse> {
  const fullUrl = `${API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        requestDto && method !== "GET" ? JSON.stringify(requestDto) : undefined,
    });

    const data = await response.json();

    return data as TResponse;
  } catch (error) {
    throw error;
  }
}

// ============= HTTP Method Helpers =============

/**
 * GET request
 */
export async function get<TResponse = any>(
  url: string,
): Promise<TResponse> {
  return callApiWithMethod<any, TResponse>('GET', url);
}

/**
 * POST request
 */
export async function post<TRequest = any, TResponse = any>(
  url: string,
  data?: TRequest,
): Promise<TResponse> {
  return callApiWithMethod<TRequest, TResponse>('POST', url, data);
}

/**
 * PUT request
 */
export async function put<TRequest = any, TResponse = any>(
  url: string,
  data?: TRequest,
): Promise<TResponse> {
  return callApiWithMethod<TRequest, TResponse>('PUT', url, data);
}

/**
 * DELETE request
 */
export async function del<TResponse = any>(
  url: string,
): Promise<TResponse> {
  return callApiWithMethod<any, TResponse>('DELETE', url);
}

/**
 * PATCH request
 */
export async function patch<TRequest = any, TResponse = any>(
  url: string,
  data?: TRequest,
): Promise<TResponse> {
  return callApiWithMethod<TRequest, TResponse>('PATCH', url, data);
}

// ============= Helper Functions =============

/**
 * Build authorization header
 */
export function authHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Get token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Save token to localStorage
 */
export function saveAuthToken(token: string): void {
  localStorage.setItem("token", token);
}

/**
 * Clear authentication token
 */
export function clearAuthToken(): void {
  localStorage.removeItem("token");
}

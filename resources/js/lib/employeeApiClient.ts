export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export class ApiError extends Error {
    public readonly status: number;
    public readonly payload: unknown;

    constructor(message: string, status: number, payload: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.payload = payload;
    }
}

export interface AuthTokenResponse {
    token: string;
    token_type: 'Bearer' | string;
}

export interface Employee {
    id: number;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    job_title: string;
    hire_date: string;
    salary: string | null;
    status: 'active' | 'inactive' | string;
    created_at: string;
    updated_at: string;
}

export interface EmployeeResourceResponse {
    data: Employee;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: unknown;
    meta: unknown;
}

export interface CreateEmployeeInput {
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    job_title: string;
    hire_date: string;
    phone?: string | null;
    salary?: number | string | null;
    status?: 'active' | 'inactive' | string;
    employee_code?: string;
}

export interface UpdateEmployeeInput {
    employee_code?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    department?: string;
    job_title?: string;
    hire_date?: string;
    phone?: string | null;
    salary?: number | string | null;
    status?: 'active' | 'inactive' | string;
}

function jsonHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    return headers;
}

async function parseJsonSafely(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) return null;

    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function ensureOk<T>(response: Response): Promise<T> {
    if (response.ok) {
        return (await response.json()) as T;
    }

    const payload = await parseJsonSafely(response);
    throw new ApiError(`Request failed with status ${response.status}`, response.status, payload);
}

export async function createAuthToken(
    fetcher: FetchLike,
    baseUrl: string,
    input: { email: string; password: string; device_name: string },
): Promise<AuthTokenResponse> {
    const response = await fetcher(new URL('/api/auth/token', baseUrl), {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify(input),
    });

    return await ensureOk<AuthTokenResponse>(response);
}

export async function listEmployees(fetcher: FetchLike, baseUrl: string, token: string, page?: number): Promise<PaginatedResponse<Employee>> {
    const url = new URL('/api/employees', baseUrl);
    if (page) url.searchParams.set('page', String(page));

    const response = await fetcher(url, {
        method: 'GET',
        headers: jsonHeaders(token),
    });

    return await ensureOk<PaginatedResponse<Employee>>(response);
}

export async function createEmployee(
    fetcher: FetchLike,
    baseUrl: string,
    token: string,
    input: CreateEmployeeInput,
): Promise<EmployeeResourceResponse> {
    const response = await fetcher(new URL('/api/employees', baseUrl), {
        method: 'POST',
        headers: jsonHeaders(token),
        body: JSON.stringify(input),
    });

    return await ensureOk<EmployeeResourceResponse>(response);
}

export async function getEmployee(fetcher: FetchLike, baseUrl: string, token: string, employeeId: number): Promise<EmployeeResourceResponse> {
    const response = await fetcher(new URL(`/api/employees/${employeeId}`, baseUrl), {
        method: 'GET',
        headers: jsonHeaders(token),
    });

    return await ensureOk<EmployeeResourceResponse>(response);
}

export async function updateEmployee(
    fetcher: FetchLike,
    baseUrl: string,
    token: string,
    employeeId: number,
    input: UpdateEmployeeInput,
): Promise<EmployeeResourceResponse> {
    const response = await fetcher(new URL(`/api/employees/${employeeId}`, baseUrl), {
        method: 'PUT',
        headers: jsonHeaders(token),
        body: JSON.stringify(input),
    });

    return await ensureOk<EmployeeResourceResponse>(response);
}

export async function deleteEmployee(fetcher: FetchLike, baseUrl: string, token: string, employeeId: number): Promise<void> {
    const response = await fetcher(new URL(`/api/employees/${employeeId}`, baseUrl), {
        method: 'DELETE',
        headers: jsonHeaders(token),
    });

    if (response.status === 204) return;

    await ensureOk<unknown>(response);
}

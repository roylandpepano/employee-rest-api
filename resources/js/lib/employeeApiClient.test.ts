import { describe, expect, it, vi } from 'vitest';

import {
    ApiError,
    createAuthToken,
    createEmployee,
    deleteEmployee,
    getEmployee,
    listEmployees,
    updateEmployee,
    type FetchLike,
} from './employeeApiClient';

function jsonResponse(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

describe('employee API client (item #1: auth + employee CRUD)', () => {
    it('happy path: authenticates then performs full employee CRUD (AAA)', async () => {
        // Arrange
        const baseUrl = 'http://localhost:8000';
        const token = 'plain-text-token';

        const fetchMock: FetchLike = vi
            .fn()
            .mockResolvedValueOnce(jsonResponse(200, { token, token_type: 'Bearer' }))
            .mockResolvedValueOnce(
                jsonResponse(201, {
                    data: {
                        id: 123,
                        employee_code: 'EMP-000123',
                        first_name: 'Roy',
                        last_name: 'Lance',
                        email: 'roy.lance@example.com',
                        department: 'Engineering',
                        job_title: 'Software Engineer',
                        hire_date: '2024-01-01',
                        salary: '90000.00',
                        status: 'active',
                        created_at: '2026-01-21T10:00:00.000000Z',
                        updated_at: '2026-01-21T10:00:00.000000Z',
                    },
                }),
            )
            .mockResolvedValueOnce(
                jsonResponse(200, {
                    data: {
                        id: 123,
                        employee_code: 'EMP-000123',
                        first_name: 'Roy',
                        last_name: 'Lance',
                        email: 'roy.lance@example.com',
                        department: 'Engineering',
                        job_title: 'Software Engineer',
                        hire_date: '2024-01-01',
                        salary: '90000.00',
                        status: 'active',
                        created_at: '2026-01-21T10:00:00.000000Z',
                        updated_at: '2026-01-21T10:00:00.000000Z',
                    },
                }),
            )
            .mockResolvedValueOnce(
                jsonResponse(200, {
                    data: {
                        id: 123,
                        employee_code: 'EMP-000123',
                        first_name: 'Roy',
                        last_name: 'Lance',
                        email: 'roy.lance@example.com',
                        department: 'Engineering',
                        job_title: 'Senior Software Engineer',
                        hire_date: '2024-01-01',
                        salary: '90000.00',
                        status: 'inactive',
                        created_at: '2026-01-21T10:00:00.000000Z',
                        updated_at: '2026-01-21T10:00:01.000000Z',
                    },
                }),
            )
            .mockResolvedValueOnce(new Response(null, { status: 204 }));

        // Act
        const auth = await createAuthToken(fetchMock, baseUrl, {
            email: 'test@example.com',
            password: 'password',
            device_name: 'vitest',
        });

        const created = await createEmployee(fetchMock, baseUrl, auth.token, {
            first_name: 'Roy',
            last_name: 'Lance',
            email: 'roy.lance@example.com',
            department: 'Engineering',
            job_title: 'Software Engineer',
            hire_date: '2024-01-01',
            salary: 90000,
            status: 'active',
        });

        const shown = await getEmployee(fetchMock, baseUrl, auth.token, created.data.id);

        const updated = await updateEmployee(fetchMock, baseUrl, auth.token, created.data.id, {
            job_title: 'Senior Software Engineer',
            status: 'inactive',
        });

        await deleteEmployee(fetchMock, baseUrl, auth.token, created.data.id);

        // Assert
        expect(auth).toEqual({ token, token_type: 'Bearer' });
        expect(created.data.email).toBe('roy.lance@example.com');
        expect(shown.data.id).toBe(123);
        expect(updated.data.job_title).toBe('Senior Software Engineer');
        expect(updated.data.status).toBe('inactive');

        expect(vi.mocked(fetchMock)).toHaveBeenCalledTimes(5);

        // spot-check request formation for a couple calls
        const firstCall = vi.mocked(fetchMock).mock.calls[0];
        expect(String(firstCall[0])).toBe('http://localhost:8000/api/auth/token');
        expect(firstCall[1]?.method).toBe('POST');

        const createCall = vi.mocked(fetchMock).mock.calls[1];
        expect(String(createCall[0])).toBe('http://localhost:8000/api/employees');
        expect(createCall[1]?.method).toBe('POST');
        expect(createCall[1]?.headers).toMatchObject({
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        });
    });

    it('throws ApiError on unauthorized employee list', async () => {
        // Arrange
        const baseUrl = 'http://localhost:8000';
        const fetchMock: FetchLike = vi.fn().mockResolvedValue(
            jsonResponse(401, {
                message: 'Unauthenticated.',
            }),
        );

        // Act
        const run = () => listEmployees(fetchMock, baseUrl, 'bad-token');

        // Assert
        await expect(run()).rejects.toBeInstanceOf(ApiError);
        await expect(run()).rejects.toMatchObject({
            status: 401,
        });

        expect(vi.mocked(fetchMock)).toHaveBeenCalledTimes(2);
    });
});

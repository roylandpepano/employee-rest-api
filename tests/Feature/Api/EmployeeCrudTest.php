<?php

use App\Models\Employee;
use App\Models\User;

function apiTokenFor(User $user): string
{
    $response = test()->postJson('/api/auth/token', [
        'email' => $user->email,
        'password' => 'password',
        'device_name' => 'tests',
    ]);

    $response->assertOk();

    return $response->json('token');
}

it('requires authentication for employee endpoints', function () {
    $this->getJson('/api/employees')->assertUnauthorized();
});

it('can create, read, update, and delete an employee', function () {
    $user = User::factory()->create();
    $token = apiTokenFor($user);

    $create = $this->withToken($token)->postJson('/api/employees', [
        'first_name' => 'Roy',
        'last_name' => 'Lance',
        'email' => 'roy.lance@example.com',
        'department' => 'Engineering',
        'job_title' => 'Software Engineer',
        'hire_date' => '2024-01-01',
        'salary' => 90000,
        'status' => 'active',
    ]);

    $create->assertCreated();

    $employeeId = $create->json('data.id');

    $show = $this->withToken($token)->getJson("/api/employees/{$employeeId}");
    $show->assertOk()->assertJsonPath('data.email', 'roy.lance@example.com');

    $update = $this->withToken($token)->putJson("/api/employees/{$employeeId}", [
        'job_title' => 'Senior Software Engineer',
        'status' => 'inactive',
    ]);

    $update->assertOk()
        ->assertJsonPath('data.job_title', 'Senior Software Engineer')
        ->assertJsonPath('data.status', 'inactive');

    $this->withToken($token)->deleteJson("/api/employees/{$employeeId}")->assertNoContent();

    $this->withToken($token)->getJson("/api/employees/{$employeeId}")->assertNotFound();
});

it('lists employees with pagination', function () {
    $user = User::factory()->create();
    $token = apiTokenFor($user);

    Employee::factory()->count(20)->create();

    $response = $this->withToken($token)->getJson('/api/employees');

    $response->assertOk()
        ->assertJsonStructure([
            'data',
            'links',
            'meta',
        ]);
});

<?php

use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Requests\StoreEmployeeRequest;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('AAA: can issue Sanctum token for valid credentials (unit-style)', function () {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
        // password is "password" by default factory hash
    ]);

    $controller = new AuthTokenController;

    $request = Request::create('/api/auth/token', 'POST', [
        'email' => $user->email,
        'password' => 'password',
        'device_name' => 'unit-tests',
    ]);

    // Act
    $response = $controller->store($request);

    // Assert
    expect($response->getStatusCode())->toBe(200);

    $payload = $response->getData(true);

    expect($payload)->toHaveKeys(['token', 'token_type']);
    expect($payload['token_type'])->toBe('Bearer');
    expect($payload['token'])->toBeString()->not->toBeEmpty();
    expect($payload['token'])->toContain('|');

    $this->assertDatabaseCount('personal_access_tokens', 1);
});

test('AAA: store defaults status=active and auto-generates employee_code (unit-style)', function () {
    // Arrange
    Employee::factory()->create();

    $controller = new EmployeeController;

    $request = StoreEmployeeRequest::create('/api/employees', 'POST', [
        'first_name' => 'Roy',
        'last_name' => 'Lance',
        'email' => 'roy.lance@example.com',
        'department' => 'Engineering',
        'job_title' => 'Software Engineer',
        'hire_date' => '2024-01-01',
        'salary' => 90000,
        // intentionally omit: status, employee_code
    ]);

    $request->setContainer(app())->setRedirector(app('redirect'));

    // Trigger prepareForValidation() + rules
    $request->validateResolved();

    // Act
    $response = $controller->store($request);

    // Assert
    expect($response->getStatusCode())->toBe(201);

    $payload = $response->getData(true);

    expect($payload)->toHaveKey('data');
    expect($payload['data']['status'])->toBe('active');
    expect($payload['data']['employee_code'])->toBe('EMP-000002');

    $this->assertDatabaseHas('employees', [
        'email' => 'roy.lance@example.com',
        'employee_code' => 'EMP-000002',
        'status' => 'active',
    ]);
});

test('AAA: invalid credentials throw a validation exception (unit-style)', function () {
    // Arrange
    $user = User::factory()->create([
        'email' => 'test@example.com',
    ]);

    $controller = new AuthTokenController;

    $request = Request::create('/api/auth/token', 'POST', [
        'email' => $user->email,
        'password' => 'wrong-password',
        'device_name' => 'unit-tests',
    ]);

    // Act
    $run = fn () => $controller->store($request);

    // Assert
    expect($run)->toThrow(ValidationException::class);

    $this->assertDatabaseCount('personal_access_tokens', 0);
});

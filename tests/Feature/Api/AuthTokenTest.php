<?php

use App\Models\User;

it('issues a sanctum token with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'api@example.com',
    ]);

    $response = $this->postJson('/api/auth/token', [
        'email' => $user->email,
        'password' => 'password',
        'device_name' => 'tests',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['token', 'token_type']);

    expect($response->json('token_type'))->toBe('Bearer');
});

it('rejects invalid credentials', function () {
    User::factory()->create([
        'email' => 'api@example.com',
    ]);

    $response = $this->postJson('/api/auth/token', [
        'email' => 'api@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(422);
});

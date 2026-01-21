<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        static $sequence = 1;

        return [
            'employee_code' => 'EMP-'.str_pad((string) $sequence++, 6, '0', STR_PAD_LEFT),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'department' => fake()->randomElement([
                'Engineering',
                'Human Resources',
                'Finance',
                'Sales',
                'Marketing',
                'Operations',
                'Customer Support',
                'IT',
            ]),
            'job_title' => fake()->jobTitle(),
            'hire_date' => fake()->dateTimeBetween('-10 years', 'now')->format('Y-m-d'),
            'salary' => fake()->optional()->randomFloat(2, 25000, 250000),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }
}

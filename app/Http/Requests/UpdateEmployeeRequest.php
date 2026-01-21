<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, \Illuminate\Contracts\Validation\ValidationRule|mixed|string>>
     */
    public function rules(): array
    {
        $employee = $this->route('employee');

        return [
            'employee_code' => ['sometimes', 'string', 'max:50', Rule::unique('employees', 'employee_code')->ignore($employee)],
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'email:rfc', 'max:255', Rule::unique('employees', 'email')->ignore($employee)],
            'phone' => ['nullable', 'string', 'max:30'],
            'department' => ['sometimes', 'string', 'max:100'],
            'job_title' => ['sometimes', 'string', 'max:100'],
            'hire_date' => ['sometimes', 'date'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'string', Rule::in(['active', 'inactive'])],
        ];
    }
}

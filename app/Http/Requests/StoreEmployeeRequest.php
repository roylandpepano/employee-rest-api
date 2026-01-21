<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
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
        return [
            'employee_code' => ['sometimes', 'string', 'max:50', Rule::unique('employees', 'employee_code')],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email:rfc', 'max:255', Rule::unique('employees', 'email')],
            'phone' => ['nullable', 'string', 'max:30'],
            'department' => ['required', 'string', 'max:100'],
            'job_title' => ['required', 'string', 'max:100'],
            'hire_date' => ['required', 'date'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'string', Rule::in(['active', 'inactive'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->missing('status')) {
            $this->merge(['status' => 'active']);
        }
    }
}

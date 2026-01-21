<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Http\Response;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::query()
            ->latest('id')
            ->paginate(15);

        return EmployeeResource::collection($employees);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();

        if (! isset($validated['employee_code'])) {
            $validated['employee_code'] = $this->generateEmployeeCode();
        }

        $employee = Employee::create($validated);

        return (new EmployeeResource($employee))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Employee $employee)
    {
        return new EmployeeResource($employee);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());

        return new EmployeeResource($employee->fresh());
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->noContent();
    }

    private function generateEmployeeCode(): string
    {
        $nextId = (int) (Employee::max('id') ?? 0) + 1;

        return sprintf('EMP-%06d', $nextId);
    }
}

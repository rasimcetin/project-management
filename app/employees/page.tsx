
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmployees } from "@/_actions/employe";

type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
};

export default async function EmployeesPage() {
const employees = await getEmployees();


  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Link href="/employees/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
          {employees.map((employee: Employee) => (
            <div
              key={employee.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                  <div className="mt-2">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">
                      {employee.position}
                    </span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {employee.department}
                    </span>
                  </div>
                </div>
                <Link href={`/employees/${employee.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}

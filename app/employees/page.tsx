import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { getEmployees } from "@/_actions/employe";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <Link
            href="/employees/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            New Employee
          </Link>
      </div>

      <div className="flex items-center space-x-4 bg-card p-4 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search employees..." 
            className="pl-9 w-full"
          />
        </div>
        <Button variant="outline">
          Filters
        </Button>
      </div>

      {employees.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No employees yet</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Get started by adding your first employee to the system.
            </p>
            <Link href="/employees/new">
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee: Employee) => (
            <Link 
              href={`/employees/${employee.id}`} 
              key={employee.id}
              className="block group"
            >
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {employee.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {employee.email}
                      </p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Position</span>
                      <span className="font-medium">{employee.position}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Department</span>
                      <span className="font-medium">{employee.department}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

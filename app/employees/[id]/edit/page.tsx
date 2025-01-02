import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import EditEmployeeForm from './EditEmployeeForm';

async function getEmployee(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) notFound();
  return employee;
}

export default async function EditEmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const employee = await getEmployee(id);

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Edit Employee</h1>
      <div className="bg-card rounded-lg shadow-sm p-6">
        <EditEmployeeForm employee={employee} />
      </div>
    </div>
  );
}

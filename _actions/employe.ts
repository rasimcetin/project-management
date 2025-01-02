'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type EmployeeFormState = {
    errors?: {
      name?: string[];
      email?: string[];
      position?: string[];
      department?: string[];
      description?: string[];
      _form?: string[];
    };
    message?: string | null;
};

const employeeSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    position: z.string().min(3),
    department: z.string().min(3),
});


export async function getEmployees() {
  try {
    return await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    throw new Error('Failed to fetch employees');
  }
}

export async function deleteEmployee(id: string) {
  try {
    await prisma.employee.delete({
      where: { id },
    });

    revalidatePath('/employees');
    return { message: 'Employee deleted successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to delete employee.',
    };
  }
}

export async function createEmployee(prevState: EmployeeFormState, formData: FormData) {
  const validatedFields = employeeSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    position: formData.get('position'),
    department: formData.get('department'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  try {
    await prisma.employee.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        position: validatedFields.data.position,
        department: validatedFields.data.department,
      },
    });

    revalidatePath('/employees');
    return { message: 'Employee created successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to create employee.',
    };
  }
}

export async function updateEmployee(
  id: string,
  state: EmployeeFormState,
  formData: FormData
): Promise<EmployeeFormState> {
  const validatedFields = employeeSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    position: formData.get('position'),
    department: formData.get('department'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Employee.',
    };
  }

  try {
    await prisma.employee.update({
      where: { id },
      data: validatedFields.data,
    });
    revalidatePath('/employees');
    return { message: 'Updated Employee.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Update Employee.' };
  }
}

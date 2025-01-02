'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
});

export type ProjectFormState = {
  errors?: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
  message?: string | null;
};

export async function createProject(
  prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const validatedFields = projectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  try {
    await prisma.project.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
      },
    });

    revalidatePath('/projects');
    return { message: 'Project created successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to create project.',
    };
  }
}

export async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    throw new Error('Failed to fetch projects');
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/projects');
    return { message: 'Project deleted successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to delete project.',
    };
  }
}

export async function updateProject(
  id: string,
  formData: FormData,
): Promise<ProjectFormState> {
  const validatedFields = projectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
      },
    });

    revalidatePath('/projects');
    return { message: 'Project updated successfully' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to update project.',
    };
  }
}

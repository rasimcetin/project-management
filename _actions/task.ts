'use server';

import { prisma } from '@/lib/db';



export async function getTasks() {
  return await prisma.task.findMany({
    include: {
      employee: true,
      requirement: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getTask(id: string) {
  return await prisma.task.findUnique({
    where: { id },
    include: {
      employee: true,
      requirement: true,
    },
  });
}

export async function createTask(data: {
  title: string;
  description?: string;
  status: string;
  priority: string;
  requirementId: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  estimate: number;
  actual: number;
  employeeId: string;
}) {
  return await prisma.task.create({
    data,
  });
}

export async function updateTask(id: string, data: {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  requirementId?: string;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  estimate?: number;
  actual?: number;
  employeeId?: string;
}) {
  return await prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTask(id: string) {
  return await prisma.task.delete({
    where: { id },
  });
}

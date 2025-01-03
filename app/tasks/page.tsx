import Link from 'next/link';
import { PlusIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  estimate: number;
  actual: number;
  employee: {
    name: string;
  };
  requirement: {
    title: string;
  };
  createdAt: Date;
};

async function getTasks() {
  return await prisma.task.findMany({
    include: {
      employee: {
        select: {
          name: true,
        },
      },
      requirement: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  });
}

export default async function TasksPage() {
  const tasks = await getTasks();

  async function handleDelete(id: string) {
    'use server';
    await deleteTask(id);
    revalidatePath('/tasks');
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage and track all tasks across your projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/tasks/new"
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Task
          </Link>
        </div>
      </div>
      
      <div className="mt-10 ring-1 ring-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Requirement</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assignee</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Timeline</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tasks.map((task: Task) => (
              <tr key={task.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <Link href={`/tasks/${task.id}`} className="hover:text-indigo-600">
                    {task.title}
                  </Link>
                  {task.description && (
                    <p className="mt-1 text-gray-500 text-xs">{task.description}</p>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {task.requirement.title}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {task.employee.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    task.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    task.priority === 'HIGH'
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>Est: {task.estimate}h / Act: {task.actual}h</span>
                  </div>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/tasks/${task.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

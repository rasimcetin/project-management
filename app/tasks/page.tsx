import Link from 'next/link';
import { PlusIcon, CalendarIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';
import prisma from '@/lib/prisma';
import { getTasks } from '@/_actions/task';
import { Task } from '@/types';
import DeleteTaskButton from '@/components/DeleteTaskButton';
import TaskCard from '@/components/TaskCard';

export default async function TasksPage() {
  const tasks = await getTasks();

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
        <div className="space-y-6">
          {tasks.map((task: Task) => (
           <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

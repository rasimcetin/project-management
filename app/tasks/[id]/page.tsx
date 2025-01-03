import Link from 'next/link';
import { getTask } from '@/_actions/task';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = await getTask(params.id);

  if (!task) {
    return <div>Task not found</div>;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/tasks"
          className="text-indigo-600 hover:text-indigo-900"
        >
          ← Back to Tasks
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <div className="mt-2 flex items-center gap-4">
            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              task.status === 'COMPLETED'
                ? 'bg-green-100 text-green-800'
                : task.status === 'IN_PROGRESS'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              task.priority === 'HIGH'
                ? 'bg-red-100 text-red-800'
                : task.priority === 'MEDIUM'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {task.priority}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.description || 'No description'}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Assignee</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.employee.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Requirement</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.requirement.title}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Timeline</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                </div>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Hours</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Estimated: {task.estimate}h / Actual: {task.actual}h</span>
                </div>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.duration} hours</dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex justify-end space-x-4">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

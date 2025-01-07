import Link from 'next/link';
import { CalendarIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';
import DeleteTaskButton from './DeleteTaskButton';
import { formatDate } from '@/lib/utils';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/tasks/${task.id}`} className="hover:text-indigo-600 transition-colors duration-200 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{task.title}</h3>
            </Link>
            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
              task.status === 'COMPLETED'
                ? 'bg-green-50 text-green-700'
                : task.status === 'IN_PROGRESS'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-gray-50 text-gray-700'
            }`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
              task.priority === 'HIGH'
                ? 'bg-red-50 text-red-700'
                : task.priority === 'MEDIUM'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-green-50 text-green-700'
            }`}>
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="mt-0.5 text-gray-600 text-xs line-clamp-1">{task.description}</p>
          )}
          <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-medium">For:</span> {task.requirement.title}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">By:</span> {task.employee.name}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {formatDate(task.startDate)} - {formatDate(task.endDate)}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {task.estimate}h / {task.actual}h
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <DeleteTaskButton id={task.id} className="text-gray-400 hover:text-red-600 transition-colors duration-200" />
          <Link
            href={`/tasks/${task.id}/edit`}
            className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
            title="Edit task"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

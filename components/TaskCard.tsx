'use client';

import { memo } from 'react';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';
import DeleteTaskButton from './DeleteTaskButton';
import { formatDate } from '@/lib/utils';
import { Task } from '@/types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaskCardProps {
  task: Task;
}

const StatusBadge = memo(({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
      status === 'COMPLETED'
        ? 'bg-green-100 text-green-700 ring-1 ring-green-700/10'
        : status === 'IN_PROGRESS'
        ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-700/10'
        : 'bg-gray-100 text-gray-700 ring-1 ring-gray-700/10'
    }`}
  >
    {status.replace('_', ' ')}
  </span>
));

const PriorityBadge = memo(({ priority }: { priority: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
      priority === 'HIGH'
        ? 'bg-red-100 text-red-700 ring-1 ring-red-700/10'
        : priority === 'MEDIUM'
        ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-700/10'
        : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/10'
    }`}
  >
    {priority}
  </span>
));

const TaskProgressChart = memo(({ estimate, actual }: { estimate: number; actual: number }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 6,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            family: 'system-ui',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgb(17 24 39 / 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
      },
    },
  };

  const data = {
    labels: ['Progress'],
    datasets: [
      {
        label: 'Estimated',
        data: [estimate],
        backgroundColor: 'rgb(99 102 241 / 0.2)',
        borderColor: 'rgb(99 102 241)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Actual',
        data: [actual],
        backgroundColor: 'rgb(34 197 94 / 0.2)',
        borderColor: 'rgb(34 197 94)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="mt-4 h-12">
      <Bar options={options} data={data} />
    </div>
  );
});

function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-100 hover:border-indigo-100">
      <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/30 rounded-xl transition-colors duration-300" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <Link 
              href={`/tasks/${task.id}`} 
              className="hover:text-indigo-600 transition-colors duration-200 flex-1 group"
            >
              <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-indigo-600">
                {task.title}
              </h3>
            </Link>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
          
          {task.description && (
            <p className="mt-1.5 text-gray-600 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-gray-700">For:</span>
              <span className="hover:text-indigo-600 transition-colors duration-200">
                {task.requirement.title}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-gray-700">By:</span>
              <span className="hover:text-indigo-600 transition-colors duration-200">
                {task.employee.name}
              </span>
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 group/date">
                <CalendarIcon className="h-4 w-4 text-gray-400 group-hover/date:text-indigo-500 transition-colors duration-200" />
                <span className="group-hover/date:text-indigo-600 transition-colors duration-200">
                  {formatDate(task.startDate)} - {formatDate(task.endDate)}
                </span>
              </span>
              <span className="flex items-center gap-1.5 group/time">
                <ClockIcon className="h-4 w-4 text-gray-400 group-hover/time:text-indigo-500 transition-colors duration-200" />
                <span className="group-hover/time:text-indigo-600 transition-colors duration-200">
                  {task.estimate}h / {task.actual}h
                </span>
              </span>
            </div>
          </div>

          <TaskProgressChart estimate={task.estimate} actual={task.actual} />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <DeleteTaskButton id={task.id} className="text-gray-400 hover:text-red-600 transition-colors duration-200" />
          <Link
            href={`/tasks/${task.id}/edit`}
            className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
            title="Edit task"
          >
            <PencilIcon className="h-4 w-4 relative group-hover:animate-spin-slow" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(TaskCard);

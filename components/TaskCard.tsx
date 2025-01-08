'use client';

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

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 p-4 border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <Link href={`/tasks/${task.id}`} className="hover:text-indigo-600 transition-colors duration-200 flex-1 group">
              <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-indigo-600">{task.title}</h3>
            </Link>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              task.status === 'COMPLETED'
                ? 'bg-green-100 text-green-700 ring-1 ring-green-700/10'
                : task.status === 'IN_PROGRESS'
                ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-700/10'
                : 'bg-gray-100 text-gray-700 ring-1 ring-gray-700/10'
            }`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              task.priority === 'HIGH'
                ? 'bg-red-100 text-red-700 ring-1 ring-red-700/10'
                : task.priority === 'MEDIUM'
                ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-700/10'
                : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-700/10'
            }`}>
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="mt-1.5 text-gray-600 text-sm line-clamp-2">{task.description}</p>
          )}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-gray-700">For:</span> {task.requirement.title}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-gray-700">By:</span> {task.employee.name}
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                {formatDate(task.startDate)} - {formatDate(task.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                {task.estimate}h / {task.actual}h
              </span>
            </div>
          </div>
          <div className="mt-4 h-12">
            <Bar
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
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
                        family: 'system-ui'
                      }
                    }
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false
                    },
                    ticks: {
                      display: false
                    },
                    border: {
                      display: false
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      display: false
                    },
                    border: {
                      display: false
                    }
                  }
                },
                layout: {
                  padding: {
                    top: 15,
                    bottom: 5,
                    left: 0,
                    right: 0
                  }
                }
              }}
              data={{
                labels: [''],
                datasets: [
                  {
                    label: 'Estimated',
                    data: [task.estimate],
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    borderColor: 'rgb(99, 102, 241)',
                    borderWidth: 2.5,
                    borderRadius: 30,
                    barThickness: 14
                  },
                  {
                    label: 'Actual',
                    data: [task.actual],
                    backgroundColor: 'rgba(0, 200, 117, 0.15)',
                    borderColor: 'rgb(0, 200, 117)',
                    borderWidth: 2.5,
                    borderRadius: 30,
                    barThickness: 14
                  },
                ],
              }}
              height={90}
            />
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

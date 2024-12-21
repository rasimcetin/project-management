'use client';

import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { updateRequirementStatus } from '@/_actions/requirement';
import type { Requirement } from '@/_actions/requirement';

interface RequirementListProps {
  requirements: Requirement[];
  projectId: string;
}

const statusStyles = {
  COMPLETED: 'bg-green-50 text-green-700 ring-green-600/20',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  PENDING: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
};

const priorityStyles = {
  HIGH: 'text-red-600 bg-red-50 ring-red-600/20',
  MEDIUM: 'text-yellow-600 bg-yellow-50 ring-yellow-600/20',
  LOW: 'text-green-600 bg-green-50 ring-green-600/20',
};

const statusIcons = {
  COMPLETED: '✓',
  IN_PROGRESS: '↻',
  PENDING: '○',
};

export default function RequirementList({ requirements, projectId }: RequirementListProps) {
  const handleStatusChange = async (id: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      await updateRequirementStatus(id, status, projectId);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const renderRequirement = (requirement: Requirement, level = 0) => (
    <div 
      key={requirement.id} 
      className={clsx(
        'group relative border-l-2 border-gray-200 transition-colors hover:border-blue-500',
        level > 0 && 'ml-6'
      )}
    >
      <Disclosure>
        {({ open }) => (
          <div>
            <div className="flex items-center gap-x-4 border-b border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50">
              <div className="flex-auto">
                <div className="flex items-center gap-x-3">
                  <select
                    value={requirement.status}
                    onChange={(e) => handleStatusChange(requirement.id, e.target.value as any)}
                    className={clsx(
                      'rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500',
                      statusStyles[requirement.status as keyof typeof statusStyles]
                    )}
                  >
                    <option value="PENDING">○ Pending</option>
                    <option value="IN_PROGRESS">↻ In Progress</option>
                    <option value="COMPLETED">✓ Completed</option>
                  </select>
                  <span
                    className={clsx(
                      'rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ring-inset',
                      priorityStyles[requirement.priority as keyof typeof priorityStyles]
                    )}
                  >
                    {requirement.priority}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                    {requirement.title}
                  </h3>
                </div>
                {requirement.description && (
                  <p className="mt-2 text-sm text-gray-500">
                    {requirement.description}
                  </p>
                )}
                {requirement.subtasks?.length > 0 && (
                  <Disclosure.Button className="mt-2 flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600">
                    <ChevronRightIcon
                      className={clsx(
                        'h-4 w-4 transition-transform',
                        open && 'rotate-90'
                      )}
                    />
                    {requirement.subtasks.length} sub-requirements
                  </Disclosure.Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <time className="text-xs text-gray-500" dateTime={requirement.createdAt.toISOString()}>
                  {new Date(requirement.createdAt).toLocaleDateString()}
                </time>
              </div>
            </div>

            {requirement.subtasks?.length > 0 && (
              <Transition
                as="div"
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-1"
              >
                <Disclosure.Panel>
                  <div className="space-y-px">
                    {requirement.subtasks.map((child: Requirement) =>
                      renderRequirement(child, level + 1)
                    )}
                  </div>
                </Disclosure.Panel>
              </Transition>
            )}
          </div>
        )}
      </Disclosure>
    </div>
  );

  return (
    <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {requirements.length > 0 ? (
        requirements.map((requirement: Requirement) => renderRequirement(requirement))
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <p className="text-sm font-medium text-gray-900">No requirements yet</p>
          <p className="text-sm text-gray-500">Create your first requirement to get started.</p>
        </div>
      )}
    </div>
  );
}

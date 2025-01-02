'use client';

import { useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon, PencilIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { updateRequirementStatus } from '@/_actions/requirement';
import type { Requirement } from '@/_actions/requirement';
import EditRequirementForm from './EditRequirementForm';

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
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
            <div className="flex items-center space-x-3 px-4 py-2">
              <button
                onClick={() => {
                  const newStatus = requirement.status === 'COMPLETED'
                    ? 'PENDING'
                    : requirement.status === 'PENDING'
                    ? 'IN_PROGRESS'
                    : 'COMPLETED';
                  handleStatusChange(requirement.id, newStatus);
                }}
                className={clsx(
                  'flex-none rounded-full p-1',
                  statusStyles[requirement.status]
                )}
              >
                {statusIcons[requirement.status]}
              </button>
              
              <span className="flex-grow text-sm font-medium text-gray-900">
                {requirement.title}
              </span>

              <button
                onClick={() => {
                  setEditingRequirement(requirement);
                  setIsEditModalOpen(true);
                }}
                className="invisible group-hover:visible rounded p-1 text-gray-400 hover:text-gray-600"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              
              <span
                className={clsx(
                  'rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                  priorityStyles[requirement.priority]
                )}
              >
                {requirement.priority}
              </span>

              {requirement.subtasks?.length > 0 && (
                <Disclosure.Button className="rounded p-1 hover:bg-gray-100">
                  <ChevronRightIcon
                    className={clsx(
                      'h-5 w-5 text-gray-500',
                      open && 'rotate-90 transform'
                    )}
                  />
                </Disclosure.Button>
              )}
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
      {editingRequirement && (
        <EditRequirementForm
          requirement={editingRequirement}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingRequirement(null);
          }}
          onUpdate={() => {
            // Trigger a refresh of the requirements list
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

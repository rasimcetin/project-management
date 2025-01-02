'use client';

import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import EditProjectForm from './EditProjectForm';
import RequirementList from './RequirementList';
import NewRequirementDialog from './NewRequirementDialog';
import { useState } from 'react';
import type { Requirement } from '@/_actions/requirement';
import type { ProjectData } from './types';

// Utility function for date formatting
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const ProjectHeader = ({ project, requirementsCount }: { project: ProjectData; requirementsCount: number }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="space-y-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Projects
        </Link>
        <EditProjectForm project={project} onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-sm text-gray-600">{project.description}</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-700"
      >
        <PencilIcon className="h-4 w-4" />
        Edit Project
      </button>
    </div>
  );
};

export const ProjectMetadata = ({ createdAt, requirementsCount }: { createdAt: Date; requirementsCount: number }) => (
  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <dt className="text-sm font-medium text-gray-500">Created</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-900">{formatDate(createdAt)}</dd>
    </div>
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <dt className="text-sm font-medium text-gray-500">Requirements</dt>
      <dd className="mt-1 text-lg font-semibold text-gray-900">{requirementsCount}</dd>
    </div>
  </dl>
);

export const RequirementsSection = ({ requirements, projectId }: { requirements: Requirement[]; projectId: string }) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
      <NewRequirementDialog projectId={projectId} />
    </div>
    <div className="mt-6">
      <RequirementList requirements={requirements} projectId={projectId} />
    </div>
  </div>
);

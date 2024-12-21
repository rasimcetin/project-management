"use client";

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { createProject, ProjectFormState } from '@/_actions/project';
import { useActionState } from 'react';

const initialState: ProjectFormState = {
  errors: {},
  message: null,
};

export default function NewProjectPage() {
  const [state, formAction] = useActionState(createProject, initialState);

  return (
    <div className="bg-white">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Create New Project</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Provide basic information about your project to get started.
            </p>
          </div>

          <form action={formAction} className="md:col-span-2">
            <div className="space-y-6 rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Project Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    placeholder="Enter your project name"
                  />
                  {state?.errors?.name && (
                    <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                    placeholder="Describe your project"
                  />
                  {state?.errors?.description && (
                    <p className="mt-2 text-sm text-red-600">{state.errors.description}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {state.message && (
                  <p className="text-sm text-red-600">{state.message}</p>
                )}
                <Link
                  href="/projects"
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Create Project
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

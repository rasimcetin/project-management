"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { createProject, ProjectFormState } from '@/_actions/project';
import { useActionState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const initialState: ProjectFormState = {
  errors: {},
  message: null,
};

const MAX_DESCRIPTION_LENGTH = 500;

export default function NewProjectPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(createProject, initialState);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [touched, setTouched] = useState({ name: false, description: false });

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(e.target.value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const charactersRemaining = MAX_DESCRIPTION_LENGTH - description.length;
  const isNameValid = name.length >= 3;

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createProject({}, formData);
      if (!result?.errors) {
        toast.success('Requirement created successfully!', {
          style: {
            background: '#22c55e',
            color: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '500'
          }
        });
        router.push('/projects');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Projects
          </Link>
        </div>

        <div className="space-y-10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Project</h1>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Launch your next project by providing some basic information to get started.
                </p>
              </div>
              
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="text-sm font-medium text-blue-800">Tips</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-blue-700">
                  <li>Choose a clear, descriptive name</li>
                  <li>Add detailed description for better collaboration</li>
                  <li>You can edit these details later</li>
                </ul>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="md:col-span-2">
              <div className="space-y-8 rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Project Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={handleNameChange}
                      onBlur={() => setTouched({ ...touched, name: true })}
                      className={`block w-full rounded-lg border-0 py-2.5 transition-all duration-200 ${
                        touched.name && !isNameValid
                          ? 'ring-2 ring-red-500 focus:ring-red-500'
                          : 'ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500'
                      } px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none sm:text-sm`}
                      placeholder="e.g., Website Redesign 2024"
                    />
                    {touched.name && !isNameValid && (
                      <p className="mt-2 text-sm text-red-600">Project name should be at least 3 characters long</p>
                    )}
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
                      value={description}
                      onChange={handleDescriptionChange}
                      onBlur={() => setTouched({ ...touched, description: true })}
                      className="block w-full rounded-lg border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 sm:text-sm"
                      placeholder="What's this project about? Include key goals and objectives..."
                    />
                    <div className="mt-2 flex justify-between text-sm">
                      <span className={`${charactersRemaining < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                        {charactersRemaining} characters remaining
                      </span>
                    </div>
                    {state?.errors?.description && (
                      <p className="mt-2 text-sm text-red-600">{state.errors.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  {state.message && (
                    <p className="text-sm text-red-600">{state.message}</p>
                  )}
                  <Link
                    href="/projects"
                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={!isNameValid}
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

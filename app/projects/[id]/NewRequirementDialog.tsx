'use client';

import { Fragment, useActionState, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createRequirement } from '@/_actions/requirement';
import { type RequirementFormState } from '@/_actions/requirement';
import { Toaster, toast } from 'react-hot-toast';

const initialState: RequirementFormState = {
  message: null,
  errors: {},
};

const MAX_DESCRIPTION_LENGTH = 500;

export default function NewRequirementDialog({ projectId, parentId }: { projectId: string; parentId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [state, formAction] = useActionState<RequirementFormState, FormData>(createRequirement, initialState);

  const handleSubmit = async (formData: FormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      const result = await createRequirement({}, formData);
      if (!result?.errors) {
        setIsOpen(false);
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
        setDescription('');
      } else if (result.message) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to create requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-indigo-500 hover:shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
      >
        <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-90" />
        New Requirement
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => !isSubmitting && setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all sm:p-8">
                  <Dialog.Title as="div" className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">New Requirement</h3>
                    <button
                      type="button"
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                      onClick={() => !isSubmitting && setIsOpen(false)}
                      disabled={isSubmitting}
                      aria-label="Close dialog"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>

                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="mt-6">
                    <input type="hidden" name="projectId" value={projectId} />
                    {parentId && <input type="hidden" name="parentId" value={parentId} />}
                    <input type="hidden" name="status" value="PENDING" />
                    <input type="hidden" name="priority" value="MEDIUM" />

                    <div className="space-y-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          required
                          className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Enter a clear, concise title"
                          disabled={isSubmitting}
                        />
                        {state.errors?.title && (
                          <p className="mt-2 text-sm text-red-600" role="alert">{state.errors.title}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <textarea
                            name="description"
                            id="description"
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
                            className="block w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Describe the requirement in detail..."
                            disabled={isSubmitting}
                          />
                          <div className="mt-2 flex justify-end">
                            <span className={`text-sm ${description.length >= MAX_DESCRIPTION_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                              {description.length}/{MAX_DESCRIPTION_LENGTH} characters
                            </span>
                          </div>
                        </div>
                        {state.errors?.description && (
                          <p className="mt-2 text-sm text-red-600" role="alert">{state.errors.description}</p>
                        )}
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                          onClick={() => !isSubmitting && setIsOpen(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Creating...
                            </>
                          ) : (
                            'Create Requirement'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

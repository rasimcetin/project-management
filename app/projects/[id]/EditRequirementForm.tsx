'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { updateRequirement } from '@/_actions/requirement';
import type { Requirement } from '@/_actions/requirement';
import { toast } from 'react-hot-toast';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface EditRequirementFormProps {
  requirement: Requirement;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditRequirementForm({ 
  requirement, 
  isOpen, 
  onClose,
  onUpdate 
}: EditRequirementFormProps) {
  const [title, setTitle] = useState(requirement.title);
  const [description, setDescription] = useState(requirement.description || '');
  const [priority, setPriority] = useState(requirement.priority);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const maxDescriptionLength = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await updateRequirement(requirement.id, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
      });
      toast.success('Requirement updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update requirement:', error);
      setError('Failed to update requirement. Please try again.');
      toast.error('Failed to update requirement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (p: Requirement['priority']) => {
    switch (p) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog 
              className="mx-auto max-w-lg w-full rounded-xl bg-white p-6 shadow-2xl"
              onClose={onClose}
            >
              <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                Edit Requirement
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-colors
                             focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400"
                    required
                    maxLength={100}
                    placeholder="Enter requirement title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    maxLength={maxDescriptionLength}
                    placeholder="Enter requirement description (optional)"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-colors
                             focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400 resize-y"
                  />
                  <div className="mt-1 text-sm text-gray-500 flex justify-end">
                    {description.length}/{maxDescriptionLength} characters
                  </div>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Requirement['priority'])}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-colors
                             focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400"
                  >
                    {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                      <option key={p} value={p} className={getPriorityColor(p as Requirement['priority'])}>
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700
                             bg-white border border-gray-300 hover:bg-gray-50 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white
                             bg-blue-600 hover:bg-blue-700 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Dialog>
          </Transition>
        </div>
      </Dialog>
    </Transition>
  );
}

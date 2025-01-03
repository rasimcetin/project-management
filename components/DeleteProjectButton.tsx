'use client';

import { TrashIcon } from '@heroicons/react/24/outline';

type DeleteProjectButtonProps = {
  onDelete: () => Promise<void>;
};

export default function DeleteProjectButton({ onDelete }: DeleteProjectButtonProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this project?')) {
      await onDelete();
    }
  };

  return (
    <button
      type="submit"
      className="inline-flex items-center text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
      onClick={handleDelete}
    >
      <TrashIcon className="h-4 w-4 mr-1" />
      Delete
    </button>
  );
}

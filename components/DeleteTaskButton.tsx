'use client';

import { useTransition } from 'react';
import { deleteTask } from '@/_actions/task';
import { useRouter } from 'next/navigation';

interface DeleteTaskButtonProps {
  id: string;
  className?: string;
}

export default function DeleteTaskButton({ id, className }: DeleteTaskButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    await deleteTask(id);
    router.refresh();
  };

  return (
    <button
      onClick={() => startTransition(() => handleDelete())}
      disabled={isPending}
      className={className}
    >
      Delete
    </button>
  );
}
"use client";

import { JSX, useCallback } from "react";
import { AdminGuard } from "@/components/admin-guard";
import { useCreatePostMutation } from "@/services/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/image-uploader";

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(1),
  summary: z.string().optional(),
  publishedAt: z.string().optional()
});

type FormInput = z.infer<typeof schema>;

const NewPostPage = (): JSX.Element => {
  const router = useRouter();
  const [createPost, { isLoading }] = useCreatePostMutation();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormInput>({ resolver: zodResolver(schema) });
  const contentValue = watch('content');

  const handleInsertImage = useCallback((url: string): void => {
    const toInsert = `\n![](${url})\n`;
    setValue('content', `${contentValue ?? ''}${toInsert}`);
  }, [contentValue, setValue]);

  const handleCreate = useCallback(async (data: FormInput): Promise<void> => {
    await createPost(data).unwrap();
    router.replace('/admin/posts');
  }, [createPost, router]);

  return (
    <AdminGuard>
      <h2 className="text-2xl font-semibold mb-4">New Post</h2>
      <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
          <input id="title" {...register('title')} className="w-full rounded-md border px-3 py-2" aria-invalid={Boolean(errors.title)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="slug">Slug</label>
          <input id="slug" {...register('slug')} className="w-full rounded-md border px-3 py-2" aria-invalid={Boolean(errors.slug)} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium mb-1" htmlFor="content">Content</label>
            <ImageUploader onUploaded={handleInsertImage} />
          </div>
          <textarea id="content" {...register('content')} className="w-full rounded-md border px-3 py-2 h-40" aria-invalid={Boolean(errors.content)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="summary">Summary</label>
          <input id="summary" {...register('summary')} className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="publishedAt">Published At</label>
          <input id="publishedAt" type="datetime-local" {...register('publishedAt')} className="w-full rounded-md border px-3 py-2" />
        </div>
        <button type="submit" disabled={isLoading} className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-50">{isLoading ? 'Saving...' : 'Save'}</button>
      </form>
    </AdminGuard>
  );
};

export default NewPostPage;



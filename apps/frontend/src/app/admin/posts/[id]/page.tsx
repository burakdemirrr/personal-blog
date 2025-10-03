"use client";

import { JSX, useCallback } from "react";
import { AdminGuard } from "@/components/admin-guard";
import { useGetAdminPostsQuery, useUpdatePostMutation } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type FormInput = {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  publishedAt?: string;
};

const EditPostPage = (): JSX.Element => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { data } = useGetAdminPostsQuery();
  const current = useMemo(() => (data ?? []).find((p) => p.id === id), [data, id]);
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const { register, handleSubmit, reset } = useForm<FormInput>();

  useEffect(() => {
    if (current) {
      reset({
        title: current.title,
        slug: current.slug,
        content: current.content,
        publishedAt: current.publishedAt ?? undefined,
        summary: current.summary  ?? undefined
      });
    }
  }, [current, reset]);

  const handleSave = useCallback(async (data: FormInput): Promise<void> => {
    await updatePost({ id, body: data }).unwrap();
    router.replace('/admin/posts');
  }, [id, updatePost, router]);

  if (!current) return <div className="py-10">Loading...</div>;

  return (
    <AdminGuard>
      <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
          <input id="title" {...register('title')} className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="slug">Slug</label>
          <input id="slug" {...register('slug')} className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="content">Content</label>
          <textarea id="content" {...register('content')} className="w-full rounded-md border px-3 py-2 h-40" />
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

export default EditPostPage;



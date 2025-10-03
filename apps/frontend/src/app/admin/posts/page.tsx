"use client";

import Link from "next/link";
import { AdminGuard } from "@/components/admin-guard";
import { useDeletePostMutation, useGetAdminPostsQuery } from "@/services/api";
import { JSX, useState, useCallback, memo, useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Memoized table row component
const PostRow = memo(({ 
  post, 
  onDelete 
}: { 
  post: any; 
  onDelete: (id: string, title: string) => void;
}) => {
  const handleDeleteClick = useCallback(() => {
    onDelete(post.id, post.title);
  }, [post.id, post.title, onDelete]);

  const formattedDate = useMemo(() => {
    return post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—";
  }, [post.publishedAt]);

  return (
    <tr className="border-b">
      <td className="py-2 pr-2">{post.title}</td>
      <td className="py-2 pr-2">{post.slug}</td>
      <td className="py-2 pr-2">{formattedDate}</td>
      <td className="py-2 pr-2 space-x-2">
        <Link className="underline" href={`/admin/posts/${post.id}`}>Edit</Link>
        <button
          className="text-red-600 underline"
          onClick={handleDeleteClick}
          aria-label={`Delete ${post.title}`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
});

PostRow.displayName = 'PostRow';

const AdminPostsPage = (): JSX.Element => {
  const { data, isLoading } = useGetAdminPostsQuery();
  const [deletePost] = useDeletePostMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const handleDelete = useCallback(async () => {
    if (selectedId) {
      await deletePost(selectedId).unwrap();
      setDialogOpen(false);
      setSelectedId(null);
      setSelectedTitle('');
    }
  }, [selectedId, deletePost]);

  const handleOpenDialog = useCallback((id: string, title: string) => {
    setDialogOpen(true);
    setSelectedId(id);
    setSelectedTitle(title);
  }, []);

  const handleCloseDialog = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedId(null);
      setSelectedTitle('');
    }
  }, []);

  return (
    <AdminGuard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Posts</h2>
        <Link className="rounded-md bg-black text-white px-3 py-2" href="/admin/posts/new" tabIndex={0} aria-label="Create post">New Post</Link>
      </div>
      {isLoading && <p>Loading...</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-2">Title</th>
              <th className="py-2 pr-2">Slug</th>
              <th className="py-2 pr-2">Published</th>
              <th className="py-2 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p) => (
              <PostRow key={p.id} post={p} onDelete={handleOpenDialog} />
            ))}
          </tbody>
        </table>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold">{selectedTitle}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} autoFocus>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminGuard>
  );
};

export default AdminPostsPage;



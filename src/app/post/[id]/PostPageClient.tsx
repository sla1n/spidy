"use client";

import {
  createComment,
  deletePost,
  getPostById,
  toggleLike,
} from "@/actions/post.action";
import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton, useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import {
  HeartIcon,
  LogInIcon,
  MessageCircleIcon,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type Post = Awaited<ReturnType<typeof getPostById>>;

function PostPageClient({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) {
  if (!post) return;
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : +1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted successfully");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Post deleted successfully");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4 justify-between items-center min-w-0">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="w-8 h-8 sm:w-14 sm:h-14">
              <AvatarImage src={post.author.image ?? "/avatar.png"} />
            </Avatar>
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
              <Link
                href={`/profile/${post.author.username}`}
                className="font-semibold truncate"
              >
                {post.author.name}
              </Link>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href={`/profile/${post.author.username}`}>
                  @{post.author.username}
                </Link>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
              </div>
            </div>
          </div>
          {/* Check if current user is the post author */}
          {dbUserId === post.author.id && (
            <DeleteAlertDialog
              isDeleting={isDeleting}
              onDelete={handleDeletePost}
            />
          )}
        </div>

        {post.image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt="Post content"
              className="w-1/2 mx-auto h-auto object-cover"
            />
          </div>
        )}

        <p className="mt-4 text-lg text-foreground break-words">
          <Link href={`/post/${post.id}`}>{post.content}</Link>
        </p>

        <div className="flex items-center py-2 space-x-4">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              className={`text-muted-foreground gap-2 ${
                hasLiked
                  ? "text-red-500 hover:text-red-600"
                  : "hover:text-red-500"
              }`}
              onClick={handleLike}
            >
              {hasLiked ? (
                <HeartIcon className="size-5 fill-current" />
              ) : (
                <HeartIcon className="size-5" />
              )}
              <span>{optimisticLikes}</span>
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground gap-2"
              >
                <HeartIcon className="size-5" />
                <span>{optimisticLikes}</span>
              </Button>
            </SignInButton>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-2 hover:text-blue-500"
          >
            <MessageCircleIcon
              className={`size-5 
                 
              `}
            />
            <span>{post.comments.length}</span>
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-4">
            {/* DISPLAY COMMENTS */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="size-8 flex-shrink-0">
                  <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-sm">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      @{comment.author.username}
                    </span>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-sm break-words">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {user ? (
            <div className="flex space-x-3">
              <Avatar className="size-8 flex-shrink-0">
                <AvatarImage src={user?.imageUrl || "/avatar.png"} />
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end mt-4">
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    className="flex items-center gap-2"
                    disabled={!newComment.trim() || isCommenting}
                  >
                    {isCommenting ? (
                      "Posting..."
                    ) : (
                      <>
                        <SendIcon className="size-4" />
                        Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
              <SignInButton mode="modal">
                <Button variant="outline" className="gap-2">
                  <LogInIcon className="size-4" />
                  Sign in to comment
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default PostPageClient;

import { getPostById } from "@/actions/post.action";
import { notFound } from "next/navigation";
import PostPageClient from "./PostPageClient";
import { getDbUserId } from "@/actions/user.action";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  return {
    title: `Post | ${post ? post.author.username : "Not found"}`,
  };
}

async function PostPageServer({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  const dbUserId = await getDbUserId();
  if (!post) notFound();

  return <PostPageClient post={post} dbUserId={dbUserId} />;
}
export default PostPageServer;

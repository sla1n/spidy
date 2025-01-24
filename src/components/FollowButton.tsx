"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";
import { isFollowing } from "@/actions/profile.action";

function FollowButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const following = await isFollowing(userId);
        setHasFollowed(following);
      } catch (error) {
        toast.error("Failed to load follow status");
      }
    };
    fetchFollowStatus();
  }, [userId]);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      await toggleFollow(userId);
      setHasFollowed((prev) => !prev);
      toast.success(
        `User ${hasFollowed ? "unfollowed" : "followed"} successfully`
      );
    } catch (error) {
      toast.error("Error following the user!");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const followText = hasFollowed ? "Unfollow" : "Follow";

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      className="w-20"
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : followText}
    </Button>
  );
}

export default FollowButton;

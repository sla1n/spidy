"use client";

import { getUsersByUsername } from "@/actions/user.action";
import FollowButton from "@/components/FollowButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type Users = Awaited<ReturnType<typeof getUsersByUsername>>;

function SearchClientPage({
  users,
  dbUserId,
}: {
  users: Users;
  dbUserId: String | null;
}) {
  return (
    <Card className="py-4">
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-2 items-center justify-between "
            >
              <div className="flex items-center gap-4">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-sm">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    <p>@{user.username}</p>
                  </Link>
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.name}
                  </Link>

                  <div className="flex gap-2">
                    <p className="text-muted-foreground">
                      {user._count.followers}{" "}
                      {user._count.followers.toString().slice(-1) == "1"
                        ? "follower"
                        : "followers"}
                    </p>
                    <p className="text-muted-foreground">
                      {user._count.posts}{" "}
                      {user._count.posts.toString().slice(-1) == "1"
                        ? "post"
                        : "posts"}
                    </p>
                  </div>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default SearchClientPage;

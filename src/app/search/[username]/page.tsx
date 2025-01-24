import { getDbUserId, getUsersByUsername } from "@/actions/user.action";
import SearchClientPage from "./SearchClientPage";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  return {
    title: `Search | ${params.username}`,
  };
}

async function SearchServerPage({ params }: { params: { username: string } }) {
  const users = await getUsersByUsername(params.username);
  const dbUserId = await getDbUserId();

  return <SearchClientPage users={users} dbUserId={dbUserId} />;
}
export default SearchServerPage;

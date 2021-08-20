import useSWR from "swr";

import DashboardPosts from "../../../components/Dashboard/DashboardPosts";

import { Button } from "@material-ui/core";

import { useRouter } from "next/router";

export default function DraftsByUser() {
  const router = useRouter();

  // retrieve posts from posts api. convert swr data to name posts.

  // UPDATE TO GETDRAFTSBYUSER
  const { data: posts } = useSWR("/api/getdrafts");

  // show loading state until drafts are retrieved
  if (!posts) return "Loading...";

  return (
    <div>
      {/* pass in posts data as a prop */}
      <DashboardPosts posts={posts} />
      <Button onClick={() => router.push("/dashboard/editor")}>
        Create New Draft
      </Button>
    </div>
  );
}

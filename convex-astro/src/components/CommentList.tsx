import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import { withConvexProvider } from "../lib/convex.tsx";

export default withConvexProvider(function CommentList() {
  const comments = useQuery(api.comments.list);
  return comments === undefined ? (
    <p className="py-4 text-center text-gray-500">Loading comments...</p>
  ) : comments.length === 0 ? (
    <p className="py-4 text-center text-gray-500">No comments found.</p>
  ) : (
    <div className="space-y-6">
      {comments.map((comment) => (
        <article
          key={comment._id}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
        >
          <header className="mb-2 flex items-center justify-between">
            <strong className="font-medium text-gray-900">{comment.author}</strong>
            <span className="text-sm text-gray-500">
              {new Date(comment._creationTime).toLocaleDateString()}
            </span>
          </header>
          <main className="leading-relaxed text-gray-700">
            <p className="whitespace-pre-line">{comment.content}</p>
          </main>
        </article>
      ))}
    </div>
  );
});

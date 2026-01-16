import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "../../convex/_generated/api";
import { withConvexProvider } from "../lib/convex.tsx";

export default withConvexProvider(function CommentForm() {
  const createComment = useMutation(api.comments.create);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string>();

  const handleSubmit = async () => {
    if (!author.trim() || !content.trim()) {
      setError("You must provide an author and content");
      return;
    }

    setError(undefined);
    try {
      await createComment({ author, content });
      setAuthor("");
      setContent("");
    } catch (error) {
      console.error(error);
      setError("Submission failed, try again.");
    }
  };

  return (
    <form action={handleSubmit} className="mb-8 space-y-4">
      <input
        type="text"
        placeholder="Your name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
      <textarea
        placeholder="Leave a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] w-full resize-y rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none md:w-auto"
      >
        Post Comment
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
});

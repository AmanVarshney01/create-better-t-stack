import type { Prisma } from "@prisma/client";

import { db } from "api/src/lib/db";

export default async () => {
  try {
    // If using dbAuth, you can seed users here.
    // If you're using a different auth provider, you can seed users there.

    // Example seeding posts
    const posts: Prisma.PostCreateInput[] = [
      {
        title: "Welcome to RedwoodJS",
        body: "RedwoodJS is a full-stack web framework that brings together the best parts of React, GraphQL, Prisma, and serverless.",
      },
      {
        title: "Getting Started",
        body: "Run `yarn rw dev` to start the development server. Your app will be available at http://localhost:8910.",
      },
    ];

    for (const post of posts) {
      await db.post.create({ data: post });
    }

    console.log("Database has been seeded. 🌱");
  } catch (error) {
    console.warn("Please define your seed data.");
    console.error(error);
  }
};

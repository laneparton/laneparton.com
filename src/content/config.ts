// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      published: z.date(),
      description: z.string(),
      tags: z.array(z.string())
    })
});

const notesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    published: z.date(),
    tags: z.array(z.string())
  })
});
// Export a single `collections` object to register your collection(s)
export const collections = {
  posts: postsCollection,
  'stream-notes': notesCollection
};
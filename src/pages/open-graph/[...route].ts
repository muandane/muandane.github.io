import { OGImageRoute } from "astro-og-canvas";

const pages = {
  ...import.meta.glob('src/content/posts/**/*.md', { eager: true }),
  ...import.meta.glob('src/content/spec/**/*.md', { eager: true }),
}

export const { getStaticPaths, get } = OGImageRoute({
  // Set the name of the dynamic route segment here it’s `route`,
  // because the file is named `[...route].ts`.
  param: "route",

  // Provide our pages object here
  pages,

  // For each page, this callback will be used to
  // customize the OpenGraph image.
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.description,
  }),
});
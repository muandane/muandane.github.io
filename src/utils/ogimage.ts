// src/pages/og-image.ts
import { APIRoute } from 'astro';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { basename } from 'path';

export const get: APIRoute = async ({ params }) => {
  const { slug } = params;
  const posts = import.meta.glob('./src/content/posts/*.md');
  const postPaths = Object.entries(posts).map(([path, promise]) => ({
    slug: basename(path).replace('.md', ''),
    loadPost: promise,
  }));

  const post = postPaths.find((p) => p.slug === String(slug));
  let postTitle = 'My Blog'; // Default title if post not found

  if (post) {
    const postData = await post.loadPost();
    postTitle = postData.frontmatter.title;
  }

  const fontFilePath = `${process.cwd()}/public/fonts/Optimistic_Display_Bold.ttf`;
  const fontFile = readFileSync(fontFilePath);

  const markup = html(`
    <div style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: rgb(45,26,84); font-size: 32px; font-weight: 600;">
      <div style="font-size: 70px; margin-top: 38px; display: flex; flex-direction: column; color: white;">
        ${postTitle}
      </div>
    </div>
  `);

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Optimistic Display', data: fontFile, style: 'normal' }],
  });

  const png = sharp(Buffer.from(svg)).png();
  const response = await png.toBuffer();

  return new Response(response, {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  });
};

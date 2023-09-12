import type { APIContext } from 'astro';
import satori from 'satori'
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import dayjs from 'dayjs';

const pages = await import.meta.glob('../posts/*.md', { eager: true });

export async function GET({ params, request } : APIContext) {
  let q = `../posts/${params.id}.md`;
  const { title, published } = pages[q].frontmatter;

  const Nunito = await fetch('https://fonts.cdnfonts.com/s/15604/Nunito-Regular.woff').then(res => res.arrayBuffer())

  const markup = html`
      <div style="width: 1200px;height: 768px;display: flex;flex-direction: column;">
      <div style="width: 100%; background-color: #1c2836; height: 80%; display:flex; justify-content: center; padding: 0px 50px; flex-direction: column;">
        <div style="font-size: 48px;font-weight: bold;color: #fff;padding-bottom: 20px;">${title}</div>
        <div style="font-size: 24px;color: #fff;">${dayjs(published).format("MMMM D, YYYY")}</div>
      </div>
      <div style="background-color: #212f40;width: 100%;height: 20%;display: flex;align-items: center;justify-content: flex-end;padding: 0px 50px;border-top: 3px solid #adb5bd26;">
        <img src="https://avatars.githubusercontent.com/u/2521591?v=4" style="width: 60px;height: 60px;border-radius: 50%;margin-right: 20px;border: 2px solid #adb5bd26;">
        <div style="font-size: 32px; color: #fff;">lane parton</div>
      </div>
    </div>`;

  const svg = await satori(markup, {
    width: 1200,
    height: 768,
    fonts: [
      {
        name: 'Nunito',
        data: Nunito,
      }
    ],
  });

  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  return new Response(pngBuffer, {
    headers: { "Content-Type": "image/png" },
  });
};

export async function getStaticPaths() {
  const paths = Object.keys(pages).map((path) => {
    const [, id] = path.match(/\/posts\/(.*)\.md$/);
    return { params: { id } };
  });
  return paths;
}
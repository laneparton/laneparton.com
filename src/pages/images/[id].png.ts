import type { APIContext } from 'astro';
import satori from 'satori'
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import dayjs from 'dayjs';
import { getCollection } from "astro:content";

const allPosts = await getCollection("posts");

export async function GET({ params, request } : APIContext) {
  // Find the specific post using the route parameter
  const post = allPosts.find(p => p.slug === params.id);

  if(!post) {
    return
  }

  const { title, published, description } = post.data;

  const titleSize =
  title.length < 40 ? "text-6xl" : "text-5xl"
  const descriptionSize =
    description.length < 80 ? "text-2xl" : "text-xl"

  const Nunito = await fetch('https://fonts.cdnfonts.com/s/15604/Nunito-Regular.woff').then(res => res.arrayBuffer())

  const markup = html`
  <div tw="h-full w-full flex flex-col pt-16 px-16 relative text-2xl" style="background-color: #1c2836">
      <div tw="rounded-3xl flex flex-col gap-0" style="background-color: #212f40; border: 1px solid #2f435b;">
        <div tw="flex px-8 pb-0 mb-0">
          <div tw="flex h-6 w-6 mt-8 mr-2 rounded-full border border-red-600 border-opacity-30 bg-red-500"></div>
          <div tw="flex h-6 w-6 mt-8 mx-2 rounded-full border border-yellow-600 border-opacity-30 bg-yellow-500"></div>
          <div tw="flex h-6 w-6 mt-8 mx-2 rounded-full border border-green-600 border-opacity-30 bg-green-500"></div>
          <div tw="text-white mt-4 mx-8 px-12 py-2 rounded-full flex w-full" style="background-color: #1c2836; border: 1px solid #2f435b;">
            laneparton.com
          </div>
        </div>
        <div tw="flex flex-col w-full px-8 justify-between px-16 py-8">
          <span tw="w-full uppercase text-lg font-bold text-white">
            ${dayjs(published).format("MMMM D, YYYY")}
          </span>
          <h2
            tw="flex flex-col text-left ${titleSize} font-bold text-white mb-0"
          >
            ${title}
          </h2>
          <p
            tw="text-white ${descriptionSize} mb-8"
          >
            ${description}
          </p>
          <div tw="flex justify-between items-end w-full">
            <div tw="flex">
              <img
                tw="w-24 rounded-full"
                src="https://avatars.githubusercontent.com/u/2521591?v=4"
                alt=""
              />
              <div tw="flex flex-col px-4 py-2">
                <span tw="font-bold text-white">
                  ${" "}
                  Lane Parton${" "}
                </span>
                <span tw="text-white">
                  ${" "}
                  @laneparton${" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Nunito',
        data: Nunito,
      }
    ],
  });

  const resvg = new Resvg(svg,{
    fitTo: {
      mode: 'width',
      value: 1200,
    },
    font: {
      loadSystemFonts: false, // It will be faster to disable loading system fonts.
    },
  })
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  return new Response(pngBuffer, {
    headers: { "Content-Type": "image/png" },
  });
};

export async function getStaticPaths() {
  // Generate paths from the posts
  const paths = allPosts.map(post => {
    const { slug } = post;
    return { params: { id: slug } };
  }).filter(Boolean);  // Filter out any undefined values

  return paths;
}
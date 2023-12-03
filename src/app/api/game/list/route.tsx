import { notion } from "@/lib/Notion";
import { NextResponse } from "next/server";
import { Game } from "@/interfaces/game_interfaces";
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export async function GET() {
  const response = await notion.databases.query({
    archived: false,
    database_id: process.env.NOTION_PAGE_ID ?? "",
    page_size: 10,
  });
  const l  = response.results;
  const games: Array<Game> = l
  .filter((e) => e.object === 'page')
  .map((e, i) => {
    const ee = e as PageObjectResponse
    return {
      // @ts-ignore
      name: ee.properties.Name.title[0].plain_text,
      // @ts-ignore
      coverUrl: ee.cover?.type == 'file' ? ee.cover.file.url : ee.cover.external.url
    }
  });
  return NextResponse.json(l);
}

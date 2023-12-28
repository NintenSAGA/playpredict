"use server";

import { Card, Col, Flex, Image, Row, Typography } from "antd";
import React, { cache } from "react";
import Meta from "antd/es/card/Meta";
import { Game } from "@/interfaces/game_interfaces";
import { notion } from "@/lib/Notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Title from "antd/lib/typography/Title";
import Link from "next/link";
import { HowLongToBeatService } from "howlongtobeat";

const tagList = [
  "New Games",
  "The Legend of Zelda Collection",
  "Best Mario Games",
];

const howLongToBeatService = new HowLongToBeatService();

function GameRow({
  cardWidth,
  title,
  getGames,
}: {
  cardWidth: string;
  title: string;
  getGames: any;
}) {
  return (
    <>
      <Typography>
        <Title level={2}>{title}</Title>
      </Typography>
      <Row
        wrap={false}
        justify="start"
        style={{
          width: "90vw",
          overflow: "auto",
        }}
      >
        <GameCards
          props={{ tag: title, cardWidth: cardWidth, getGames: getGames }}
        />
      </Row>
    </>
  );
}

export default async function Home() {
  return (
    <main className="w-full">
      <Flex
        vertical
        gap="middle"
        justify={"space-between"}
        style={{ marginTop: 20, marginLeft: 20, marginRight: 0 }}
      >
        <GameRow
          cardWidth="200px"
          title={"Popular Games"}
          getGames={async () => {
            const a = await howLongToBeatService.search("");
            return a.map(
              (e) => ({ coverUrl: e.imageUrl, name: e.name }) as Game,
            );
          }}
        />
        {tagList.map((e, i) => {
          if (process.env.NOTION_SECRET) {
            return (
              <GameRow
                cardWidth="400px"
                key={i}
                title={e}
                getGames={async () => await getCachedGamesByTag(e)}
              />
            );
          }
        })}
      </Flex>
    </main>
  );
}

async function GameCards({ props }: { props: any }) {
  const games: Array<Game> = await props.getGames();
  const cardWidth = props.cardWidth;

  return games.map((game, i) => {
    return (
      <Col
        key={i}
        style={{
          marginBottom: "20px",
          width: cardWidth,
          marginRight: "30px",
          marginLeft: "10px",
        }}
      >
        <Link href={"/game/" + encodeURIComponent(game.name) + '#top'}>
          <Card
            hoverable
            style={{ width: cardWidth }}
            cover={
              <Flex
                justify="flex-start"
                style={{
                  width: "100%",
                  overflow: "hidden",
                  height: "200px",
                }}
              >
                <Image
                  alt={game.name}
                  src={game.coverUrl}
                  width="100%"
                  preview={false}
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Flex>
            }
          >
            <Meta
              title={
                <Title
                  level={5}
                  ellipsis={{
                    tooltip: true,
                  }}
                  style={{
                    width: "100%",
                  }}
                >
                  {game.name}
                </Title>
              }
            />
          </Card>
        </Link>
      </Col>
    );
  });
}

const getCachedGamesByTag = cache(getGamesByTag);

async function getGamesByTag(tag: string): Promise<Array<Game>> {
  const result = await notion.databases.query({
    database_id: process.env.NOTION_PAGE_ID ?? "",
    filter: {
      property: "Tag",
      multi_select: {
        contains: tag,
      },
    },
  });
  const results = result.results;

  return results
    .filter((e) => e.object == "page")
    .map((e) => e as PageObjectResponse)
    .map((e) => ({
      // @ts-ignore
      name: e.properties.OName.rich_text[0].plain_text,
      coverUrl:
        // @ts-ignore
        e.cover?.type == "file" ? e.cover.file.url : e.cover.external.url,
    }));
}

"use server";

import Title from "antd/lib/typography/Title";
import { HowLongToBeatEntry, HowLongToBeatService } from "howlongtobeat";
import { Card, Col, Flex, Image, Row, Tag, Typography } from "antd";
import { Game } from "@/interfaces/game_interfaces";
import Paragraph from "antd/es/typography/Paragraph";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import CountUp from "react-countup";
import Statistic from "antd/lib/statistic/Statistic";
import { Formatter } from "antd/lib/statistic/utils";
import { TimeStat } from "@/lib/components/TimeStat";

import leven from 'fast-levenshtein'
import dynamic from 'next/dynamic'

const hLTBService = new HowLongToBeatService();

const PersonalizeCard = dynamic(() => import("@/lib/components/PersonalizeCard"), {ssr: false})

const platformDict: Record<number, { name: string; color: string }> = {
  130: { name: "Nintendo Switch", color: "red" },
  48: { name: "PlayStation 4", color: "blue" },
  49: { name: "Xbox One", color: "green" },
  167: { name: "PlayStation 5", color: "geekblue" },
  169: { name: "Xbox Series X|S", color: "green" },
  6: { name: "PC", color: "orange" },
  14: { name: "Mac", color: "purple" },
  39: { name: "iOS", color: "purple" },
  41: { name: "WiiU", color: "blue" },
  5: { name: "Wii", color: "cyan" },
  20: { name: "NDS", color: "gold" },
  37: { name: "3DS", color: "geekblue" },
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const title = decodeURIComponent(params.slug);

  try {
    const entry = await searchGame(title);
    const detail = await getGameDetail(title);

    return (
      <>
        <main className="w-full">
          <Flex
            vertical
            gap={"large"}
            style={{ alignItems: "center", height: "100%" }}
          >
            <ContentCard>
              <GameInfo entry={entry} detail={detail} />
            </ContentCard>
            <ContentCard>
              <PersonalizeCard
                entry={JSON.parse(JSON.stringify(entry))}
              />
            </ContentCard>
          </Flex>
        </main>
      </>
    );
  } catch (e) {
    console.error(e);
    return (
      <>
        <Title level={1}>{title} not found.</Title>
      </>
    );
  }
}

async function searchGame(title: string) {
  const entries = await hLTBService.search(title);
  if (entries.length < 1) {
    throw new Error(
      "No entry returned. title: " + title + " entries: " + entries,
    );
  }
  return entries[0];
}

async function getGameDetail(title: string) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Client-ID", process.env.TWITCH_CID ?? "");
    myHeaders.append("Authorization", process.env.TWITCH_TOKEN ?? "");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "text/plain");
    const result = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: myHeaders,
      body: 'search "' + title + '"; fields rating, name, platforms, summary; limit 10;',
      cache: 'force-cache'
    });

    const raw: { name: string, id: number, platforms: number[], summary: string, rating?: number }[] =
      await result.json();

    if (!raw || raw.length == 0) {
      throw new Error(
        "No entry returned. title: " + title + " result: " + result,
      );
    }

    const obj = raw
    .toSorted((a, b) => {
      const n1 = a.rating == undefined ? 1 : 0
      const n2 = b.rating == undefined ? 1 : 0

      return n1 == n2 ? 0 : n1 < n2 ? -1 : 1
    })
    .toSorted((a, b) => {
      const n1 = leven.get(title, a.name)
      const n2 = leven.get(title, b.name)

      return n1 == n2 ? 0 : n1 < n2 ? -1 : 1
    })

    const game = obj[0];
    return {
      description: game.summary,
      // genre: game.genres?.map((e: any) => e.genre_name),
      platforms: game.platforms
        ?.filter((e) => platformDict[e])
        .map((e) => platformDict[e]),
    } as Game;
  } catch (e) {
    console.error(e);
  }

  return {} as Game;
}

function ContentCard({ children }: { children: ReactNode }) {
  return (
    <Card
      style={{
        marginLeft: "-1vw",
        marginRight: "4vw",
        width: "80vw",
      }}
    >
      {children}
    </Card>
  );
}

function GameInfo({
  entry,
  detail,
}: {
  entry: HowLongToBeatEntry;
  detail: Game;
}) {
  return (
    <Row wrap={false} justify={"start"} gutter={10} style={{ width: "100%" }}>
      <Col span={8} style={{ marginLeft: "-30px", marginTop: "-30px" }}>
        <Image
          src={entry.imageUrl}
          preview={false}
          width="20vw"
          style={{
            borderRadius: "10px",
            boxShadow: "5px 5px 10px gray",
          }}
        />
      </Col>
      <Col>
        <Typography style={{}}>
          <Title level={2}>{entry.name}</Title>
          <div style={{ marginBottom: "15px" }}>
            {detail.platforms?.map((e) => <Tag key={e.name} color={e.color}>{e.name}</Tag>)}
          </div>
          <Paragraph>{detail.description}</Paragraph>
        </Typography>
        <Flex gap={30} style={{ alignItems: "center" }}>
          {[
            { title: "Main Story", value: entry.gameplayMain },
            { title: "Main+Extra", value: entry.gameplayMainExtra },
            { title: "Completion", value: entry.gameplayCompletionist },
          ].map((e) => (
            <TimeStat
              key={e.title}
              title={e.title}
              value={e.value}
              suffix={"Hours"}
            />
          ))}
        </Flex>
      </Col>
    </Row>
  );
}

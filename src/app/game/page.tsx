"use server";

import { redirect } from "next/navigation";
import Title from "antd/lib/typography/Title";
import { HowLongToBeatService } from "howlongtobeat";
import { Card, Col, Flex, Image, Row, Statistic, Tag, Typography } from "antd";
import { Game } from "@/interfaces/game_interfaces";
import Paragraph from "antd/es/typography/Paragraph";

const hLTBService = new HowLongToBeatService();

const prefix =
  "https://api.mobygames.com/v1/games?api_key=" + process.env.MOBY_KEY;

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
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams || !searchParams.title) {
    redirect("/");
  }

  const title = searchParams.title as string;
  try {
    const entry = await searchGame(title);
    const game1 = await getGameDetail(title);

    return (
      <>
        <main className="w-full">
          <Flex vertical style={{ alignItems: "center", height: "100vh" }}>
            <Card
              style={{
                marginLeft: "-1vw",
                marginRight: "4vw",
                width: "80vw",
              }}
            >
              <Row
                wrap={false}
                justify={"start"}
                gutter={10}
                style={{ width: "100%" }}
              >
                <Col
                  span={8}
                  style={{ marginLeft: "-30px", marginTop: "-30px" }}
                >
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
                    <div style={{marginBottom: '15px'}}>
                      {game1.platforms?.map((e) => (
                        <Tag color={e.color}>{e.name}</Tag>
                      ))}
                    </div>
                    <Paragraph>{game1.description}</Paragraph>
                  </Typography>
                  <Flex gap={30} style={{ alignItems: "center" }}>
                    <Statistic
                      title={"Main Story"}
                      value={entry.gameplayMain}
                      suffix={"Hours"}
                    />
                    <Statistic
                      title={"Main+Extra"}
                      value={entry.gameplayMainExtra}
                      suffix={"Hours"}
                    />
                    <Statistic
                      title={"Completion"}
                      value={entry.gameplayCompletionist}
                      suffix={"Hours"}
                    />
                  </Flex>
                </Col>
              </Row>
            </Card>
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
      body: 'search "' + title + '"; fields platforms, summary; limit 1;',
    });

    const obj: { id: number; platforms: number[]; summary: string }[] =
      await result.json();
    console.log(obj);

    if (!obj || obj.length == 0) {
      throw new Error(
        "No entry returned. title: " + title + " result: " + result,
      );
    }

    const game = obj[0];
    return {
      description: game.summary,
      // genre: game.genres?.map((e: any) => e.genre_name),
      platforms: game.platforms
        ?.filter((e) => platformDict[e])
        .map((e) => platformDict[e]),
    };
  } catch (e) {
    console.error(e);
  }

  return {} as Game;
}

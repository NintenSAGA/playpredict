"use server";

import { redirect } from "next/navigation";
import Title from "antd/lib/typography/Title";
import { HowLongToBeatService } from "howlongtobeat";
import { Card, Col, Flex, Image, Layout, Row, Statistic } from 'antd'

const hLTBService = new HowLongToBeatService();

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

    return (
      <>
        <main className="w-full">
          <Flex vertical justify='center' style={{alignItems: 'center'}}>
            <Card style={{
              marginLeft: '-1vw',
              marginRight: '4vw',
              width: '80vw'
            }}>
              <Row gutter={30} style={{width: '100%'}}>
                <Col style={{marginLeft: '-24px', marginTop: '-24px'}}>
                  <Image src={entry.imageUrl} style={{
                    borderRadius: '10px',
                    height: '30vh'
                  }}/>
                </Col>
                <Col>
                    <Title level={2}>
                      {entry.name}
                    </Title>
                    <Flex gap={30} style={{alignItems: 'center'}}>
                      <Statistic title={'Main Story'} value={entry.gameplayMain} suffix={'Hours'}/>
                      <Statistic title={'Main+Extra'} value={entry.gameplayMainExtra} suffix={'Hours'}/>
                      <Statistic title={'Completion'} value={entry.gameplayCompletionist} suffix={'Hours'}/>
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

"use client";

import { Card, Flex, Image, List, Select, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { HowLongToBeatEntry } from "howlongtobeat";
import { useRouter } from "next/navigation";
import {
  CheckCircleOutlined, CheckSquareOutlined, CrownOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons'

export function SearchBar() {
  function onChange(value: string) {
    setKW(value);
    setLoading(true);
  }

  const [kw, setKW] = useState("");
  const [data, setData] = useState([] as HowLongToBeatEntry[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/game/search", {
      method: "POST",
      body: JSON.stringify({ content: kw }),
      cache: 'force-cache'
    })
      .then((r) => r.json())
      .then((r) => r as HowLongToBeatEntry[])
      .then((r) => {
        setData(r);
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, [kw]);

  return (
    <>
      <Select
        placeholder="Search you games here"
        showSearch
        filterOption={false}
        size={"large"}
        style={{ width: "400px" }}
        dropdownRender={(e) => (
          <Spin size={"large"} spinning={loading}>
            <DropList data={data} />
          </Spin>
        )}
        onSearch={onChange}
        loading={loading}
        onBlur={() => {
          setLoading(false);
        }}
      />
    </>
  );
}

export function DropList({ data }: any) {
  const router = useRouter();

  return (
    <>
      <Flex
        style={{
          overflow: "scroll",
          height: "50vh",
          width: "100%",
        }}
      >
        <List
          itemLayout="vertical"
          size="small"
          dataSource={data}
          style={{ width: "100%" }}
          renderItem={(item: HowLongToBeatEntry) => {
            return (
              <a href={"/game/" + encodeURIComponent(item.name)}>
                <Card
                  hoverable
                  style={{
                    height: "100px",
                    marginTop: "10px",
                    marginLeft: "5px",
                    marginRight: "5px",
                    border: "solid #5A54F9 1px",
                  }}
                >
                  <List.Item
                    key={item.id}
                    style={{
                      width: "350px",
                      marginTop: "-20px",
                      marginLeft: "-20px",
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{
                          height: '75px',
                          width: '80px',
                          overflow: 'hidden',
                          borderRadius: 10,
                        }}>
                          <Image
                            preview={false}
                            width={"80px"}
                            alt={item.name}
                            src={item.imageUrl}
                          />
                        </div>
                      }
                      title={
                        <Title
                          level={5}
                          ellipsis={{
                            tooltip: true,
                          }}
                        >
                          {item.name}
                        </Title>
                      }
                      description={
                        <Flex gap={"middle"}>
                          <IconText
                            icon={CheckCircleOutlined}
                            text={item.gameplayMain}
                            key="list-vertical-star-o"
                          />
                          <IconText
                            icon={CheckSquareOutlined}
                            text={item.gameplayMainExtra}
                            key="list-vertical-like-o"
                          />
                          <IconText
                            icon={CrownOutlined}
                            text={item.gameplayCompletionist}
                            key="list-vertical-message"
                          />
                        </Flex>
                      }
                    />
                  </List.Item>
                </Card>
              </a>
            );
          }}
        />
      </Flex>
    </>
  );
}

const IconText = ({ icon, text }: { icon: React.FC; text: number }) => (
  <Space size={5}>
    {React.createElement(icon)}
    {text + 'h'}
  </Space>
);

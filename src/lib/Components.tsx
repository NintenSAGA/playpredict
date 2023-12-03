"use client";

import { Flex, Image, List, Select, Spin } from 'antd'
import React, { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { HowLongToBeatEntry } from "howlongtobeat";
import { useRouter } from "next/navigation";

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
        showSearch
        filterOption={false}
        size={"large"}
        style={{ width: "500px" }}
        dropdownRender={(e) => (
          <Spin size={'large'} spinning={loading}>
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
              <a href={"/game/" + encodeURI(item.name)}>
                <List.Item
                  key={item.id}
                  extra={
                    <Image
                      preview={false}
                      height={"50px"}
                      alt="logo"
                      src={item.imageUrl}
                    />
                  }
                >
                  <Title level={5}>{item.name}</Title>
                </List.Item>
              </a>
            );
          }}
        />
      </Flex>
    </>
  );
}

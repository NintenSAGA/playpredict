"use client";

import { Card, Col, Flex, Row, Slider, Space } from "antd";
import { Fragment, useState } from "react";
import Title from "antd/lib/typography/Title";
import { SliderMarks } from "antd/es/slider";
import { HowLongToBeatEntry } from "howlongtobeat";
import { Game } from "@/interfaces/game_interfaces";
import Paragraph from "antd/es/typography/Paragraph";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeMarks: SliderMarks = {
  0: "0h",
  12: "12h",
  24: "24h",
};

export function PersonalizeCard({ entry }: { entry: object }) {
  const [timeArray, setTA] = useState(
    Array.from({ length: DAYS.length }).fill(0) as number[],
  );

  return (
    <Row>
      <Col span={12}>
        <Card style={{ boxShadow: "5px 5px 10px lightgray" }}>
          <Flex gap={"middle"} vertical justify={"flex-start"} align={"start"}>
            {DAYS.map((label, idx) => {
              return (
                <Fragment>
                  <Flex
                    gap={5}
                    vertical
                    justify={"flex-start"}
                    align={"start"}
                    style={{ width: "100%" }}
                  >
                    <Title level={5}>{label}</Title>
                    <Row
                      gutter={20}
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Col span={18}>
                        <Slider
                          min={0}
                          max={24}
                          step={0.5}
                          value={timeArray[idx]}
                          onChange={(v) => {
                            const clone = [...timeArray];
                            clone[idx] = v;
                            setTA(clone);
                          }}
                          style={{ width: "100%" }}
                          marks={timeMarks}
                        />
                      </Col>
                      <Col span={6}>
                        <Flex gap={8} align={"end"} justify={"end"}>
                          <h1 style={{ fontSize: 23, fontWeight: "bold" }}>
                            {timeArray[idx] + " "}
                          </h1>
                          <h2 style={{ fontSize: 20, fontWeight: "lighter" }}>
                            Hours
                          </h2>
                        </Flex>
                      </Col>
                    </Row>
                  </Flex>
                </Fragment>
              );
            })}
          </Flex>
        </Card>
      </Col>
    </Row>
  );
}

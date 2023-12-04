"use client";

import { Card, Col, Flex, Row, Slider } from "antd";
import { Fragment, useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { SliderMarks } from "antd/es/slider";
import { getCookie, setCookie } from "cookies-next";

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

const cookieKey = 'time-data';

export function PersonalizeCard({
  entry,
  timeData,
}: {
  entry: object;
  timeData: number[] | null;
}) {
  const [timeArray, setTA] = useState(
    timeData ?? Array.from({ length: DAYS.length }).fill(0) as number[]
  );

  useEffect(() => {
    setCookie(cookieKey, JSON.stringify(timeArray));
    console.log("Cookie set: " + getCookie(cookieKey));
  }, [timeArray]);

  return (
    <Row>
      <Col span={12}>
        <Card style={{ boxShadow: "5px 5px 10px lightgray" }}>
          <Flex gap={"middle"} vertical justify={"flex-start"} align={"start"}>
            {DAYS.map((label, idx) => {
              return (
                <Fragment key={idx}>
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

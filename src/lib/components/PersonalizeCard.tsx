"use client";

import { Button, Card, Col, Flex, Row, Slider } from 'antd'
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import Title from "antd/lib/typography/Title";
import { SliderMarks } from "antd/es/slider";
import { setCookie } from "cookies-next";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeMarks: SliderMarks = {
  0: "0h",
  12: "12h",
  24: "24h",
};

const cookieKey = "time-data";

export function PersonalizeCard({
  entry,
  timeData,
}: {
  entry: {
    gameplayMain: number;
    gameplayMainExtra: number;
    gameplayCompletionist: number;
  };
  timeData: string | null;
}) {
  let pTimeData = Array.from({ length: DAYS.length }).fill(0) as number[];
  if (timeData != null) {
    try {
      pTimeData = JSON.parse(timeData) as number[];
    } catch (e) {
      console.error("Error occurred when reading cookies. Error: " + e);
    }
  }

  const [timeArray, setTA] = useState(pTimeData);

  useEffect(() => {
    setCookie(cookieKey, JSON.stringify(timeArray));
  }, [timeArray]);

  const calcResult = calculate(timeArray, entry.gameplayMain, new Date(), 0)

  return (
    <Row gutter={20}>
      <Col span={12}>
        <HalfContentCard>
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
        </HalfContentCard>
      </Col>
      <Col span={12}>
        <HalfContentCard>
          <div>
            <h2>
              You're about to finish this game:
            </h2>
            <ul>
              <li>Start to play: today</li>
              <li>Hours to go: {entry.gameplayMain}</li>
              <li>Days to go: {calcResult.daysToGo}</li>
              <li>Finish playing on: {calcResult.endDate?.toLocaleDateString()}</li>
            </ul>
          </div>
        </HalfContentCard>
      </Col>
    </Row>
  );
}

function HalfContentCard(props: { children?: React.ReactNode }) {
  return (
    <Card style={{ boxShadow: "5px 5px 10px lightgray" }}>
      {props.children}
    </Card>
  );
}

function calculate(
  timeArray: number[],
  totalHour: number,
  beginDate: Date,
  hoursPlayed: number,
) : CalcResult {
  let allZero = true
  for (let time of timeArray) {
    if (time != 0) {
      allZero = false
      break
    }
  }
  if (allZero) {
    return {} as CalcResult
  }

  let today = beginDate;
  let daysToGo = 0;
  for (
    let sum = hoursPlayed;
    sum < totalHour;
    daysToGo++,
      sum += timeArray[today.getDay()],
      today.setDate(today.getDate() + 1)
  ) {}

  today.setDate(today.getDate() - 1);

  return {
    daysToGo: daysToGo,
    endDate: today,
  };
}

interface CalcResult {
  daysToGo: number,
  endDate: Date,
}
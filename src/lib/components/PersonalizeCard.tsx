"use client";

import { Card, Col, Flex, Radio, Row, Slider } from "antd";
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Title from "antd/lib/typography/Title";
import { SliderMarks } from "antd/es/slider";
import { getCookie, setCookie } from "cookies-next";
import {
  CalcResult,
  SliderConfig,
  TimeData,
} from "@/interfaces/personalization_interface";

const dailyMarks: SliderMarks = {
  0: "0h",
  12: "12h",
  24: "24h",
};

const weeklyMarks: SliderMarks = {
  0: "0d",
  24: "1d",
  48: "2d",
  72: "3d",
  96: "4d",
  120: "5d",
  144: "6d",
  168: "7d",
};

const sliderConfigs: SliderConfig[] = [
  {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    min: 0,
    max: 24,
    step: 0.5,
    sliderMarks: dailyMarks,
  },
  {
    labels: ["Each workday", "Each weekend day"],
    min: 0,
    max: 24,
    step: 0.5,
    sliderMarks: dailyMarks,
  },
  {
    labels: ["Each week"],
    min: 0,
    max: 168,
    step: 1,
    sliderMarks: weeklyMarks,
  },
];

const timeDataKey = "time-data";

const emptyArray = () => Array.from({ length: 7 }).fill(0) as number[];

export default function PersonalizeCard({
  entry,
}: {
  entry: {
    gameplayMain: number;
    gameplayMainExtra: number;
    gameplayCompletionist: number;
  };
}) {
  let initTimeArrays: number[][] = Array.from({ length: 3 }).fill([
    ...emptyArray(),
  ]) as number[][];
  let initTimeType = 0;
  let timeData: TimeData = {
    timeType: 0,
    timeArrays: initTimeArrays,
  };
  const rawTimeData = getCookie(timeDataKey);
  if (rawTimeData !== undefined) {
    try {
      let parsed = JSON.parse(rawTimeData) as TimeData;
      console.log(JSON.stringify(parsed));
      if (
        parsed != null &&
        parsed.timeType != undefined &&
        parsed.timeArrays != undefined &&
        parsed.timeArrays.length == 3
      ) {
        timeData = parsed;
        initTimeType = parsed.timeType;
        initTimeArrays = parsed.timeArrays;
      }
    } catch (e) {
      console.error("Error occurred when reading cookies. Error: " + e);
    }
  }

  const [timeArrays, setTAs] = useState(initTimeArrays);
  const [timeType, setTT] = useState(initTimeType);

  const calcResult = calculate(
    timeArrays[timeType],
    entry.gameplayMain,
    new Date(),
    0,
  );

  return (
    <Row gutter={20}>
      <Col span={12}>
        <HalfContentCard>
          <Flex gap={"middle"} vertical justify={"flex-start"} align={"start"}>
            <Radio.Group
              options={[
                { label: "Daily", value: 0 },
                { label: "Workday/Weekend", value: 1 },
                { label: "Weekly", value: 2 },
              ]}
              value={timeType}
              onChange={(e) => {
                const clone = e.target.value;
                setTT(clone);
                setCookie(
                  timeDataKey,
                  JSON.stringify({ ...timeData, timeType: clone }),
                );
              }}
              optionType="button"
              buttonStyle="solid"
            />
            {sliderConfigs[timeType].labels.map((label, idx) => (
              <TimeSlider
                key={label}
                label={label}
                idx={idx}
                timeType={timeType}
                timeArrays={timeArrays}
                setTAs={setTAs}
                timeData={timeData}
                sliderConfig={sliderConfigs[timeType]}
              />
            ))}
          </Flex>
        </HalfContentCard>
      </Col>
      <Col span={12}>
        <HalfContentCard>
          <div>
            <h2>You're about to finish this game:</h2>
            <ul>
              <li>Start to play: today</li>
              <li>Hours to go: {entry.gameplayMain}</li>
              <li>Days to go: {calcResult.daysToGo}</li>
              <li>
                Finish playing on: {calcResult.endDate?.toLocaleDateString()}
              </li>
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

function TimeSlider(
  {label, timeType, timeArrays, idx, setTAs, timeData, sliderConfig}
  : {
  label: string;
  idx: number;
  timeType: number;
  timeArrays: number[][];
  setTAs: Dispatch<SetStateAction<number[][]>>;
  timeData: TimeData;
  sliderConfig: SliderConfig
}) {

  return (
    <Flex
      vertical
      gap={5}
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
            min={sliderConfig.min}
            max={sliderConfig.max}
            step={sliderConfig.step}
            value={timeArrays[timeType][idx]}
            onChange={(v) => {
              const clone = timeArrays.map((a) => [...a]);
              clone[timeType][idx] = v;
              setTAs(clone);
              setCookie(
                timeDataKey,
                JSON.stringify({ ...timeData, timeArrays: clone }),
              );
            }}
            style={{ width: "90%" }}
            marks={sliderConfig.sliderMarks}
          />
        </Col>
        <Col span={6}>
          <Flex gap={8} align={"end"} justify={"end"}>
            <h1 style={{ fontSize: 23, fontWeight: "bold" }}>
              {timeArrays[timeType][idx] + " "}
            </h1>
            <h2 style={{ fontSize: 20, fontWeight: "lighter" }}>Hours</h2>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
}

function calculate(

  timeArray: number[],
  totalHour: number,
  beginDate: Date,
  hoursPlayed: number,
): CalcResult {
  let allZero = true;
  for (let time of timeArray) {
    if (time != 0) {
      allZero = false;
      break;
    }
  }
  if (allZero) {
    return {} as CalcResult;
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

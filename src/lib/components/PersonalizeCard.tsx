"use client";

import {
  Card,
  Col,
  DatePicker,
  Empty,
  Flex,
  InputNumber,
  Row,
  Segmented,
  Slider,
  Space, Tooltip,
} from 'antd'
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import Title from "antd/lib/typography/Title";
import { SliderMarks } from "antd/es/slider";
import { getCookie, setCookie } from "cookies-next";
import {
  CalcResult,
  HeatmapData,
  SliderConfig,
  TimeData,
} from "@/interfaces/personalization_interface";
import dayjs from "dayjs";
import { TimeStat } from "@/lib/components/TimeStat";
import Statistic from "antd/lib/statistic/Statistic";
import HeatMap from "@uiw/react-heat-map";

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
  const [beginDate, setBD] = useState(dayjs());
  const [hoursPlayed, setHP] = useState(0);
  const [timeInTotal, setTIT] = useState(entry.gameplayMain);

  const calcResult = calculate(
    timeType,
    timeArrays,
    timeInTotal,
    beginDate.toDate(),
    hoursPlayed,
  );

  return (
    <Row gutter={20} style={{width: "100%"}}>
      <Col span={12}>
        <HalfContentCard>
          <Flex gap={"middle"} vertical justify={"flex-start"} align={"start"}>
            <Segmented
              options={[
                { label: "Daily", value: 0 },
                { label: "Workday/Weekend", value: 1 },
                { label: "Weekly", value: 2 },
              ]}
              value={timeType}
              onChange={(v) => {
                const clone = v as number;
                setTT(clone);
                setCookie(
                  timeDataKey,
                  JSON.stringify({ ...timeData, timeType: clone }),
                );
              }}
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
          <Flex
            gap={"middle"}
            vertical
            justify={"flex-start"}
            align={"start"}
            style={{ width: "100%" }}
          >
            <Segmented
              options={[
                { label: "Main Story", value: entry.gameplayMain },
                { label: "Main+Extra", value: entry.gameplayMainExtra },
                { label: "Completion", value: entry.gameplayCompletionist },
              ]}
              value={timeInTotal}
              onChange={(v) => {
                setTIT(v as number);
              }}
              style={{ marginBottom: "10px" }}
            />
            <DataDisplayPanel
              timeInTotal={timeInTotal}
              beginDate={beginDate}
              setBD={setBD}
              hoursPlayed={hoursPlayed}
              setHP={setHP}
              timeType={timeType}
              calcResult={calcResult}
            />
          </Flex>
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

function DataDisplayPanel({
  timeInTotal,
  beginDate,
  setBD,
  hoursPlayed,
  setHP,
  timeType,
  calcResult,
}: {
  timeInTotal: number;
  beginDate: dayjs.Dayjs;
  setBD: Dispatch<SetStateAction<dayjs.Dayjs>>;
  hoursPlayed: number;
  setHP: Dispatch<SetStateAction<number>>;
  timeType: number;
  calcResult: CalcResult | null;
}) {
  if (calcResult === null) {
    return (
      <Empty
        style={{ width: "100%" }}
        description={
          <h1 style={{ fontSize: "20px" }}>
            Set your personal data to predict your play time.
          </h1>
        }
      ></Empty>
    );
  } else {
    return (
      <>
        <Space>
          <p>If you start(ed) to play the game on: </p>
          <DatePicker
            value={beginDate}
            onChange={(date, dateString) => {
              setBD(date === null ? dayjs() : date);
            }}
          />
        </Space>
        <Space>
          <p>And have already played for </p>
          <InputNumber
            value={hoursPlayed}
            min={0}
            onChange={(v) => setHP(v === null ? 0 : v)}
            suffix="Hour(s)"
          />
        </Space>

        <Row style={{ width: "100%" }}>
          <Col span={8}>
            <TimeStat
              title={"Hour(s) to beat"}
              value={Math.max(timeInTotal - hoursPlayed, 0)}
              suffix={"Hour(s)"}
            />
          </Col>
          <Col span={8}>
            <TimeStat
              title={"Day(s) to beat"}
              value={calcResult.daysToGo}
              suffix={"Day(s)"}
            />
          </Col>
          <Col span={8}>
            <TimeStat
              title={"Week(s) to beat"}
              value={calcResult.daysToGo / 7}
              suffix={"Week(s)"}
            />
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>

          <Col span={24}>
            <Statistic
              title={"Beat the game on"}
              value={formatDate(calcResult.endDate)}
              suffix={""}
            />
          </Col>
        </Row>
        <HeatMap
          value={calcResult.heatmapDataArray}
          // weekLabels={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
          startDate={beginDate.toDate()}
          endDate={beginDate.add(1, "year").toDate()}
          style={{ width: "100%" }}
          rectSize={7.5}
        />
      </>
    );
  }
}

function TimeSlider({
  label,
  timeType,
  timeArrays,
  idx,
  setTAs,
  timeData,
  sliderConfig,
}: {
  label: string;
  idx: number;
  timeType: number;
  timeArrays: number[][];
  setTAs: Dispatch<SetStateAction<number[][]>>;
  timeData: TimeData;
  sliderConfig: SliderConfig;
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
  timeType: number,
  timeArrays: number[][],
  totalHour: number,
  beginDate: Date,
  hoursPlayed: number,
): CalcResult | null {
  if (hoursPlayed > totalHour) {
    return {
      daysToGo: 0,
      endDate: beginDate,
      heatmapDataArray: []
    }
  }

  const curArray = timeArrays[timeType];

  let timeArray = emptyArray();
  switch (timeType) {
    case 0:
      timeArray = curArray;
      break;
    case 1:
      [0, 6].forEach((i) => (timeArray[i] = curArray[1]));
      for (let i = 1; i < 6; ++i) {
        timeArray[i] = curArray[0];
      }
      break;
    case 2:
      timeArray.fill(curArray[0] / 7);
      // timeArray[(6 + beginDate.getDay()) % 7] = curArray[0];
      break;
  }

  let allZero = true;
  for (let time of timeArray) {
    if (time != 0) {
      allZero = false;
      break;
    }
  }
  if (allZero) {
    return null;
  }

  const heatmapDataArray = [] as HeatmapData[];

  let today = beginDate;
  let daysToGo = 0;
  for (
    let sum = hoursPlayed;
    sum < totalHour;
    daysToGo++,
      sum += timeArray[today.getDay()],
      today.setDate(today.getDate() + 1)
  ) {
    const delta =timeArray[today.getDay()]
    if (delta != 0) {
      heatmapDataArray.push({
        date: formatDate(today, "/"),
        count: delta,
      });
    }
  }

  today.setDate(today.getDate() - 1);

  return {
    daysToGo: daysToGo,
    endDate: today,
    heatmapDataArray: heatmapDataArray,
  };
}

function formatDate(date: string | Date, sep: string = "-"): string {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join(sep);
}

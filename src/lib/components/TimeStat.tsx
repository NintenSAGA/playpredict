'use client'

import Statistic from "antd/lib/statistic/Statistic";
import CountUp from "react-countup";

export function TimeStat(props: {
  title: string;
  value: number;
  suffix: string;
}) {
  return (
    <Statistic
      {...props}
      formatter={(value) => <CountUp end={value as number} />}
    />
  );
}

import React from "react";
import {
  ResponsiveContainer,
  AreaChart as AreaCharts,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
const AreaChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaCharts data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Area type="monotone" dataKey="count" stroke="#2cb1bc" fill="#bef8fd" />
        <Tooltip />
      </AreaCharts>
    </ResponsiveContainer>
  );
};

export default AreaChart;

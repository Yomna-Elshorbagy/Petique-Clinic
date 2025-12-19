import { COLORS } from "./Colors";

export const pieBaseOptions = {
  tooltip: { trigger: "item" },
  legend: {
    bottom: 0,
    textStyle: {
      color: COLORS.textDark,
    },
  },
};

export const barBaseOptions = {
  tooltip: { trigger: "axis" },
  grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
  xAxis: {
    type: "category",
    axisLabel: { color: COLORS.textDark },
  },
  yAxis: {
    type: "value",
    axisLabel: { color: COLORS.textDark },
  },
};

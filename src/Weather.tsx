import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { Container, Stack, Tooltip } from "@mui/material";
import { Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import CompressIcon from "@mui/icons-material/Compress";
import AirSharpIcon from "@mui/icons-material/AirSharp";
import { BsThermometer } from "react-icons/bs";

function Weather() {
  const { isLoading, error, weatherData } = useSelector(
    (state: RootState) => state.weather
  );

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Space>
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />}
            size="large"
            tip="Učitavanje..."
          />
        </Space>
      </Stack>
    );
  }

  if (error) {
    return <Stack alignItems="center">Currently no data</Stack>;
  }

  if (!weatherData) {
    return <Stack alignItems="center">No weather data available</Stack>;
  }

  return (
    <Container maxWidth="xl">
      <Stack alignItems="center">
        <Stack direction="row" alignItems="center" spacing={3}>
          <Stack direction="row" alignItems="center">
            <BsThermometer fontSize="32px" color="#a2aba3" />
            <h3>{weatherData.main.temp} °C</h3>
          </Stack>
          <Stack justifyContent="center">
            <Tooltip
              title={weatherData.weather[0].main}
              arrow
              placement="top"
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -28],
                      },
                    },
                  ],
                },
              }}
            >
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="Weather Icon"
              />
            </Tooltip>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={4}>
          <Stack direction="row" alignItems="center">
            <CompressIcon sx={{ fontSize: "32px", color: "#a2aba3" }} />
            <h3>{weatherData.main.pressure} mps</h3>
          </Stack>
          <Stack direction="row" alignItems="center">
            <AirSharpIcon sx={{ fontSize: "32px", color: "#a2aba3" }} />
            <h3>{weatherData.wind.speed} km/h</h3>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Weather;

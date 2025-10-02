import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { Container, Stack, Tooltip, Typography } from "@mui/material";
import { Space, Spin } from "antd";
import CompressIcon from "@mui/icons-material/Compress";
import AirSharpIcon from "@mui/icons-material/AirSharp";
import { LoadingOutlined } from "@ant-design/icons";
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
    return (
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 4 },
          background: "linear-gradient(180deg, #fdfcfb, #fef9c3)",
          borderRadius: "20px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          mt: { xs: 4, md: 6 },
          minHeight: "30vh",
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%", minHeight: "20vh" }}
        >
          <Typography
            component="p"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "14px", sm: "16px" },
              color: "#4b5563",
              textAlign: "center",
            }}
          >
            Trenutno nema dostupnih vremenskih podataka
          </Typography>
        </Stack>
      </Container>
    );
  }

  if (!weatherData) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 4 },
          background: "linear-gradient(180deg, #fdfcfb, #fef9c3)",
          borderRadius: "20px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          mt: { xs: 4, md: 6 },
          minHeight: "30vh",
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%", minHeight: "20vh" }}
        >
          <Typography
            component="p"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "14px", sm: "16px" },
              color: "#4b5563",
              textAlign: "center",
            }}
          >
            Odaberite lokaciju za prikaz vremenskih podataka
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 4 },
        background: "linear-gradient(180deg, #fdfcfb, #fef9c3)", // soft cream gradient
        borderRadius: "20px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
        mt: { xs: 4, md: 6 },
      }}
    >
      <Stack alignItems="center" spacing={{ xs: 3, md: 5 }}>
        {/* Temperature + Main Weather */}
        <Stack
          direction={{ xs: "row", sm: "row" }}
          alignItems="center"
          spacing={{ xs: 2, sm: 4 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <BsThermometer fontSize="32px" color="#166534" />
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "24px", md: "28px" },
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              {Math.round(weatherData.main.temp)} °C
            </Typography>
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
                      options: { offset: [0, -28] },
                    },
                  ],
                },
              }}
            >
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="Weather Icon"
                style={{
                  width: "96px",
                  height: "96px",
                  filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
                }}
              />
            </Tooltip>
          </Stack>
        </Stack>

        {/* Pressure + Wind */}
        <Stack
          direction={{ xs: "row", sm: "row" }}
          alignItems="center"
          spacing={{ xs: 3, sm: 6 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              px: 3,
              py: 2,
              borderRadius: "16px",
              background: "linear-gradient(145deg, #ffffff, #fef9c3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <CompressIcon sx={{ fontSize: "32px", color: "#166534" }} />
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "18px", md: "20px" },
                fontWeight: 500,
                color: "#0f172a",
              }}
            >
              {weatherData.main.pressure} hPa
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              px: 3,
              py: 2,
              borderRadius: "16px",
              background: "linear-gradient(145deg, #ffffff, #fef9c3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <AirSharpIcon sx={{ fontSize: "32px", color: "#166534" }} />
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "18px", md: "20px" },
                fontWeight: 500,
                color: "#0f172a",
              }}
            >
              {weatherData.wind.speed} km/h
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Weather;

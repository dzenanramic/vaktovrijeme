import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  Fab,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getCityDetails } from "./redux/slices/weatherSlice";
import { AppDispatch } from "./redux/store";
import Locations from "./Locations";
import { Card, Spin } from "antd";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import { LoadingOutlined } from "@ant-design/icons";
import HowToPray from "./HowToPray";
import { FaQuestion } from "react-icons/fa";

const fetchPrayerLocations = async () => {
  const cachedData = localStorage.getItem("prayerLocations");

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const { data } = await axios.get(
    "https://api.vaktija.ba/vaktija/v1/lokacije"
  );
  localStorage.setItem("prayerLocations", JSON.stringify(data));

  return data;
};

const fetchPrayerTimes = async (index: number) => {
  const cachedDataKey = `prayerTimesData${index}`;
  const cachedTimestampKey = `prayerTimesTimestamp${index}`;
  const cachedData = localStorage.getItem(cachedDataKey);
  const cachedTimestamp = localStorage.getItem(cachedTimestampKey);

  const now = new Date().getTime();
  const staleTime = 5 * 60 * 1000;

  if (
    cachedData &&
    cachedTimestamp &&
    now - parseInt(cachedTimestamp) < staleTime
  ) {
    return JSON.parse(cachedData);
  }

  try {
    const { data } = await axios.get(
      `https://api.vaktija.ba/vaktija/v1/${index}`
    );

    localStorage.setItem(cachedDataKey, JSON.stringify(data));
    localStorage.setItem(cachedTimestampKey, now.toString());

    return data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error;
  }
};

export default function Vaktija() {
  const [selectedPrayerTimes, setSelectedPrayerTimes] = useState<{
    datum: string;
    lokacija: string;
    vakat: string[];
  } | null>(null);

  const theme = useTheme();
  const isXsDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmOnly = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdOnly = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const titleFontSize = isXsDown
    ? "30px"
    : isSmOnly
    ? "40px"
    : isMdOnly
    ? "50px"
    : "66px";

  const dispatch: AppDispatch = useDispatch();

  const handleCityClick = async (location: string, index: number) => {
    const prayerTimes = await fetchPrayerTimes(index);
    setSelectedPrayerTimes(prayerTimes);
    dispatch(getCityDetails(location));
  };

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const response = await fetchPrayerTimes(1);
        if (!ignore) {
          setSelectedPrayerTimes(response);
          dispatch(getCityDetails(response.lokacija));
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openNamaz, setOpenNamaz] = useState(false);
  const handleClickOpenNamaz = () => setOpenNamaz(true);
  const handleCloseNamaz = () => setOpenNamaz(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["prayerLocations"],
    queryFn: fetchPrayerLocations,
  });

  if (isLoading)
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Spin
          indicator={<LoadingOutlined spin style={{ fontSize: 60 }} />}
          size="large"
        />
        <Typography
          component="p"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: { xs: "14px", sm: "16px" },
            color: "#4b5563",
            mt: 2,
            textAlign: "center",
          }}
        >
          Učitavanje...
        </Typography>
      </Stack>
    );

  if (error)
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
          minHeight: "70vh",
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%", minHeight: "50vh" }}
        >
          <Card
            style={{
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              background: "linear-gradient(145deg, #ffffff, #fef9c3)",
              borderRadius: "20px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
              padding: "32px 24px",
              maxWidth: 500,
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "20px", sm: "24px" },
                fontWeight: 600,
                color: "#dc2626",
                mb: 2,
              }}
            >
              Greška pri učitavanju
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "14px", sm: "16px" },
                color: "#4b5563",
              }}
            >
              Trenutno ne možemo učitati podatke. Molimo pokušajte kasnije.
            </Typography>
          </Card>
        </Stack>
      </Container>
    );

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
        minHeight: "70vh",
      }}
    >
      <Stack sx={{ mt: { xs: "32px", md: "60px" } }}>
        <Stack
          direction={{ xs: "row", sm: "row" }}
          alignItems={{ xs: "center", sm: "center" }}
          justifyContent="space-between"
          sx={{ gap: { xs: 2, sm: 0 } }}
        >
          <Tooltip title="Kako obaviti namaz?" arrow>
            <Fab
              size={isXsDown ? "small" : "medium"}
              sx={{
                backgroundColor: "#fef9c3",
                color: "#166534",
                "&:hover": { backgroundColor: "#fde68a" },
              }}
              aria-label="how-to-pray"
              onClick={handleClickOpenNamaz}
            >
              <FaQuestion size={isXsDown ? 16 : 20} />
            </Fab>
          </Tooltip>

          <Typography
            component="h1"
            sx={{
              fontFamily: "Playwrite HR, sans-serif",
              color: "#166534",
              fontSize: titleFontSize,
              fontWeight: 500,
              textAlign: "center",
              lineHeight: 1.1,
              textShadow: "1px 1px 3px rgba(0,0,0,0.15)",
            }}
          >
            Vaktovrijeme
          </Typography>

          <Tooltip title="Lokacije" arrow>
            <Fab
              size={isXsDown ? "small" : "medium"}
              sx={{
                backgroundColor: "#fef9c3",
                color: "#166534",
                "&:hover": { backgroundColor: "#fde68a" },
              }}
              aria-label="location"
              onClick={handleClickOpen}
            >
              <LocationOnSharpIcon sx={{ fontSize: isXsDown ? 18 : 24 }} />
            </Fab>
          </Tooltip>
        </Stack>

        <HowToPray open={openNamaz} handleClose={handleCloseNamaz} />
        <Locations
          open={open}
          handleClose={handleClose}
          handleCityClick={handleCityClick}
          data={data}
        />

        {!selectedPrayerTimes ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "40vh", mt: { xs: "40px", md: "60px" } }}
          >
            <Card
              style={{
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
                background: "linear-gradient(145deg, #ffffff, #fef9c3)",
                borderRadius: "20px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                padding: "32px 24px",
                maxWidth: 500,
              }}
            >
              <Typography
                component="h2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: { xs: "18px", sm: "20px" },
                  fontWeight: 600,
                  color: "#166534",
                  mb: 1,
                }}
              >
                Dobrodošli
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: { xs: "14px", sm: "16px" },
                  color: "#4b5563",
                }}
              >
                Podaci se učitavaju...
              </Typography>
            </Card>
          </Stack>
        ) : (
          <Stack
            sx={{
              mt: { xs: "40px", md: "60px" },
              gap: { xs: 6, md: 11 },
            }}
          >
            <Stack alignItems="center">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems="center"
                spacing={0.5}
                sx={{ textAlign: "center" }}
              >
                <LocationOnSharpIcon
                  sx={{ fontSize: "28px", color: "#166534" }}
                />
                <Typography
                  component="h1"
                  sx={{
                    color: "#14532d",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: { xs: "24px", sm: "28px", md: "32px" },
                    fontWeight: 600,
                  }}
                >
                  {selectedPrayerTimes.lokacija}
                </Typography>
              </Stack>
              <Typography
                component="p"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: { xs: "14px", sm: "16px" },
                  color: "#4b5563",
                  mt: 1,
                  textAlign: "center",
                }}
              >
                Datum: {selectedPrayerTimes.datum[1]} /{" "}
                {selectedPrayerTimes.datum[0]}
              </Typography>
            </Stack>

            <Stack
              sx={{
                flexDirection: { md: "row", sm: "column" },
                gap: { xs: 3, md: 1 },
              }}
            >
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                justifyContent="center"
              >
                {selectedPrayerTimes.vakat.map((time, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    key={index}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Card
                      title={
                        <span
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: isXsDown ? "28px" : "22px",
                            fontWeight: 600,
                            color: "#166534",
                          }}
                        >
                          {
                            [
                              "Zora",
                              "Izlazak sunca",
                              "Podne",
                              "Ikindija",
                              "Akšam",
                              "Jacija",
                            ][index]
                          }
                        </span>
                      }
                      style={{
                        textAlign: "center",
                        fontFamily: "Poppins, sans-serif",
                        background: "linear-gradient(145deg, #ffffff, #fef9c3)",
                        borderRadius: "20px",
                        color: "#166534",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                        padding: isXsDown ? "16px 12px" : "24px 16px",
                        width: "100%",
                        maxWidth: 300,
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "pointer",
                      }}
                      styles={{ body: { padding: "12px 0" } }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform =
                          "scale(1.03)";
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "0 10px 20px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform =
                          "scale(1)";
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "0 6px 16px rgba(0,0,0,0.1)";
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: isXsDown ? "32px" : "40px",
                          margin: 0,
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {time}
                      </p>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

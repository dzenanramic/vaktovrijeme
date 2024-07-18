import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Container, Fab, Grid, Stack, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { getCityDetails } from "./redux/slices/weatherSlice";
import { AppDispatch } from "./redux/store";
import Locations from "./Locations";
import { Card, Space, Spin } from "antd";
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
          console.log(response);
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
  }, []);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openNamaz, setOpenNamaz] = useState(false);

  const handleClickOpenNamaz = () => {
    setOpenNamaz(true);
  };
  const handleCloseNamaz = () => {
    setOpenNamaz(false);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["prayerLocations"],
    queryFn: fetchPrayerLocations,
  });

  const dispatch: AppDispatch = useDispatch();

  if (isLoading)
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Space>
          <Spin
            indicator={<LoadingOutlined spin style={{ fontSize: 60 }} />}
            size="large"
            tip="Učitavanje..."
          />
        </Space>
      </Stack>
    );

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container maxWidth="xl">
      <Stack marginTop="60px">
        <Stack direction="row" justifyContent="space-between">
          <Tooltip title="Kako obaviti namaz?" arrow>
            <Fab
              sx={{ backgroundColor: "#F0F0F0", color: "#97912C" }}
              aria-label="location"
              onClick={handleClickOpenNamaz}
            >
              <FaQuestion />
            </Fab>
          </Tooltip>
          <HowToPray open={openNamaz} handleClose={handleCloseNamaz} />

          <h1
            style={{
              fontFamily: "Playwrite HR, sans-serif",
              color: "#97912C",
              fontSize:
                window.innerWidth <= 488
                  ? "30px"
                  : window.innerWidth <= 648
                  ? "40px"
                  : window.innerWidth <= 1200
                  ? "50px"
                  : "66px",
              fontWeight: "400",
            }}
          >
            Vaktovrijeme
          </h1>

          <Tooltip title="Lokacije" arrow>
            <Fab
              sx={{ backgroundColor: "#F0F0F0", color: "#97912C" }}
              aria-label="location"
              onClick={handleClickOpen}
            >
              <LocationOnSharpIcon />
            </Fab>
          </Tooltip>
          <Locations
            open={open}
            handleClose={handleClose}
            handleCityClick={handleCityClick}
            data={data}
          />
        </Stack>
        {selectedPrayerTimes && (
          <Stack spacing={11} marginTop="60px">
            <Stack alignItems="center">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <LocationOnSharpIcon
                  sx={{ fontSize: "28px", color: "#a2aba3" }}
                />
                <h1 style={{ color: "#4C4B35" }}>
                  {selectedPrayerTimes.lokacija}
                </h1>
              </Stack>
              <p>
                Datum: {selectedPrayerTimes.datum[1]} /{" "}
                {selectedPrayerTimes.datum[0]}
              </p>
            </Stack>
            <Stack sx={{ flexDirection: { md: "row", sm: "column" }, gap: 1 }}>
              <Grid container spacing={3} justifyContent="center">
                {selectedPrayerTimes.vakat.map((time, index) => (
                  <Grid item xs={12} sm={12} md={2} key={index}>
                    <Card
                      title={
                        [
                          "Zora",
                          "Izlazak sunca",
                          "Podne",
                          "Ikindija",
                          "Akšam",
                          "Jacija",
                        ][index]
                      }
                      bordered={true}
                      style={{
                        textAlign: "center",
                        fontFamily: "Poppins, sans-serif",
                        backgroundColor: "inherit",
                        border: "1px solid #4C4B35",
                        borderRadius: "30px",
                        color: "#97912C",
                        fontWeight: "bold",
                        outline: "2px solid #97912C",
                        outlineOffset: "1px",
                      }}
                    >
                      <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                        {time}
                      </h1>
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

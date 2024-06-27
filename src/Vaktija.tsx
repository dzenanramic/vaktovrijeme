import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Container, Fab, Stack, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { getCityDetails } from "./redux/slices/weatherSlice";
import { AppDispatch } from "./redux/store";
import Locations from "./Locations";
import { Card, Col, Space, Spin } from "antd";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import { LoadingOutlined } from "@ant-design/icons";

const fetchPrayerLocations = async () => {
  const { data } = await axios.get(
    "https://api.vaktija.ba/vaktija/v1/lokacije"
  );
  return data;
};

const fetchPrayerTimes = async (index: number) => {
  const { data } = await axios.get(
    `https://api.vaktija.ba/vaktija/v1/${index}`
  );
  return data;
};

export default function Vaktija() {
  const [selectedPrayerTimes, setSelectedPrayerTimes] = useState<{
    datum: string;
    lokacija: string;
    vakat: string[];
  } | null>(null);

    const handleCityClick = async (location: string, index: number) => {
      dispatch(getCityDetails(location));
      const prayerTimes = await fetchPrayerTimes(index);
      setSelectedPrayerTimes(prayerTimes);
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPrayerTimes(1);
        console.log(response);
        setSelectedPrayerTimes(response);
        handleCityClick(response.lokacija, response.id);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
        <Stack direction="row" justifyContent="flex-end">
          <Tooltip title="Lokacije" arrow>
            <Fab
              sx={{ backgroundColor: "whitesmoke", color: "#a2aba3" }}
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
          <Stack spacing={7} marginTop="60px">
            <Stack alignItems="center">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <LocationOnSharpIcon
                  sx={{ fontSize: "28px", color: "#a2aba3" }}
                />
                <h1>{selectedPrayerTimes.lokacija}</h1>
              </Stack>
              <p>
                Datum: {selectedPrayerTimes.datum[1]} /{" "}
                {selectedPrayerTimes.datum[0]}
              </p>
            </Stack>
            <Stack sx={{ flexDirection: { md: "row", sm: "column" }, gap: 1 }}>
              <Col md={4} sm={9}>
                <Card
                  title="Zora"
                  bordered={true}
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                    {selectedPrayerTimes.vakat[0]}
                  </h1>
                </Card>
              </Col>
              <Col md={4} sm={9}>
                <Card
                  title="Izlazak sunca"
                  bordered={true}
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                    {selectedPrayerTimes.vakat[1]}
                  </h1>
                </Card>
              </Col>
              <Col md={4} sm={9}>
                <Card
                  title="Podne"
                  bordered={true}
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                    {" "}
                    {selectedPrayerTimes.vakat[2]}
                  </h1>
                </Card>
              </Col>
              <Col md={4} sm={9}>
                <Card
                  title="Ikindija"
                  bordered={true}
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                    {selectedPrayerTimes.vakat[3]}
                  </h1>
                </Card>
              </Col>
              <Col md={4} sm={9}>
                <Card
                  title="Akšam"
                  bordered={true}
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                    {selectedPrayerTimes.vakat[4]}
                  </h1>
                </Card>
              </Col>
              <Col md={4} sm={9}>
                <Card
                  title="Jacija"
                  bordered={true}
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                    {selectedPrayerTimes.vakat[5]}
                  </h1>
                </Card>
              </Col>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

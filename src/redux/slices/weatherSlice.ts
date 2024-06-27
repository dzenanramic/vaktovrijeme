import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface WeatherState {
  city: any;
  isLoading: boolean;
  error: string | null;
  lat: number | null;
  lon: number | null;
  weatherData: any;
}

const initialState: WeatherState = {
  city: null,
  isLoading: false,
  error: null,
  lat: null,
  lon: null,
  weatherData: null,
};

const slice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    getCitySuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.city = action.payload.cityDetails;
      state.lat = action.payload.cityDetails[0].lat;
      state.lon = action.payload.cityDetails[0].lon;
    },
    getWeatherSucces(state, action: PayloadAction<any>) {
      (state.isLoading = false),
        (state.weatherData = action.payload.weatherData);
    },
  },
});

export const {
  startLoading,
  hasError,
  getCitySuccess,
  getWeatherSucces,
  clearError,
} = slice.actions;

export default slice.reducer;

export function getCityDetails(city: string) {
  return async (dispatch: Dispatch) => {
    dispatch(clearError());
    dispatch(startLoading());
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=6df73c284cc68e6f6fdf4e41ed2511e9`
      );
      const { lat, lon } = response.data[0];
      dispatch(
        getCitySuccess({
          cityDetails: response.data,
        })
      );
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=4fb5f090339724ca4e049fcf374c2699
`;

      const weatherResponse = await axios.get(weatherUrl);
      dispatch(getWeatherSucces({ weatherData: weatherResponse.data }));
      return response;
    } catch (error: any) {
      dispatch(hasError(error.message));
    }
  };
}

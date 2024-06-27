import Vaktija from "./Vaktija";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Weather from "./Weather";
import { Container, Stack } from "@mui/material";

const queryClient = new QueryClient();

function App() {
  return (
    <Container maxWidth="xl">
      <QueryClientProvider client={queryClient}>
        <Stack spacing={7}>
          <Vaktija />
          <Weather />
        </Stack>
      </QueryClientProvider>
    </Container>
  );
}

export default App;

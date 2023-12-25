import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Search from "@/pages/search";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Search />
    </QueryClientProvider>
  );
}

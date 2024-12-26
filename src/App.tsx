import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/defaut";
import { GlobalStyle } from "./styles/global";
import { Transactions } from "./pages/transactions";

export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />

      <Transactions />
    </ThemeProvider>
  )
}



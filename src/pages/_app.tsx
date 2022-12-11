import "../styles/globale.css";
interface Props {
  Components: any;
  pageProps: any;
}
function App({ Components, pageProps }: Props) {
  return <Components {...pageProps} />;
}

export default App;

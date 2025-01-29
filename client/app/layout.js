// app/layout.js
"use client"; // Make sure it's a client-side component
import { Provider } from "react-redux";
import store from "../redux/store"; // Import your Redux store
import { ToastContainer } from "react-toastify";
import "./globals.css"; // Import global styles
import "react-datepicker/dist/react-datepicker.css";
import Head from "next/head";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Diabetic Retinopathy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/merai_fevicon.png" />
      </Head>

      <body>
        <Provider store={store}>
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <ToastContainer /> {/* Wrap your app with Redux provider */}
          <div className="min-h-screen">{children}</div>
          {/* </PersistGate> */}
        </Provider>
      </body>
    </html>
  );
}

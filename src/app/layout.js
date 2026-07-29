
import './globals.css';
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* CSS */}
        <link
          rel="stylesheet"
          href="/assets/css/style.css?version=4.2"
        />

        <link
          rel="stylesheet"
          href="/assets2/css/style.css?version=4.2"
        />

        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/assets/imgs/template/favicon.svg"
        />
      </head>

      <body suppressHydrationWarning={true}>
        {children}

        {/* =============================
            ASSETS 1 SEQUENCE
        ============================== */}

        {/* jQuery First */}
        <Script
          src="/assets/js/vendor/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/assets/js/vendor/jquery-migrate-3.3.0.min.js"
          strategy="beforeInteractive"
        />

        {/* Bootstrap */}
        <Script
          src="/assets/js/vendor/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />

        {/* Plugins */}
        <Script
          src="/assets/js/plugins/waypoints.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/plugins/wow.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/plugins/magnific-popup.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/plugins/select2.min.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/plugins/isotope.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/plugins/scrollup.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/plugins/swiper-bundle.min.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/plugins/counterup.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets/js/plugins/perfect-scrollbar.min.js"
          strategy="afterInteractive"
        />

        {/* Main JS last */}
        <Script
          src="/assets/js/main.js"
          strategy="afterInteractive"
        />

        {/* =============================
            ASSETS 2 SEQUENCE
        ============================== */}

        {/* Modernizr */}
        <Script
  src="/assets/js/vendor/modernizr-3.6.0.min.js"
  strategy="beforeInteractive"
/>
        <Script
          src="/assets2/js/vendor/modernizr-3.6.0.min.js"
          strategy="beforeInteractive"
        />

        {/* jQuery */}
        <Script
          src="/assets2/js/vendor/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/assets2/js/vendor/jquery-migrate-3.3.0.min.js"
          strategy="beforeInteractive"
        />

        {/* Bootstrap */}
        <Script
          src="/assets2/js/vendor/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />

        {/* Plugins */}
        <Script
          src="/assets2/js/plugins/waypoints.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/magnific-popup.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/perfect-scrollbar.min.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/select2.min.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/swiper-bundle.min.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/jquery.circliful.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/charts/index.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/charts/xy.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/charts/Animated.js"
          strategy="afterInteractive"
        />

        <Script
          src="/assets2/js/plugins/armcharts5-script.js"
          strategy="afterInteractive"
        />

<Script
  src="/assets2/js/plugins/moment.min.js"
  strategy="afterInteractive"
/>      

  {/* Main JS last */}
        <Script
          src="/assets2/js/main.js?v=4.1"
          strategy="afterInteractive"
        />


        <Script src="https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js" />
      </body>
    </html>
  );
}
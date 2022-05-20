import { useCallback, useState } from "react";
import { useClientRouting, useRoutePropagation } from "@shopify/app-bridge-react";
import { Frame, TopBar, Navigation } from "@shopify/polaris";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/home";
import Settings from "./pages/settings";

function AppFrame() {
  const location = useLocation();
  const navigate = useNavigate();

  const history = {
    replace: navigate,
  };

  useClientRouting(history);
  useRoutePropagation(location);

  // Track the open state of the mobile navigation
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const toggleMobileNavigationActive = useCallback(
    () => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive),
    []
  );

  return (
    <Frame
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigationActive}
      topBar={<TopBar showNavigationToggle onNavigationToggle={toggleMobileNavigationActive} />}
      navigation={
        <Navigation location={location.pathname}>
          <Navigation.Section
            items={[
              {
                url: "/",
                label: "Dashboard",
                exactMatch: true,
              },
              {
                url: "/settings",
                label: "Settings",
                exactMatch: true,
              },
            ]}
          />
        </Navigation>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Frame>
  );
}

export default AppFrame;

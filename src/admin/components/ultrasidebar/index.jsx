import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Appcontext } from "../../../approuter";

const SidebarultraNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const role = localStorage.getItem("admin_role");
  const { setIsAuth } = useContext(Appcontext);

  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMouseOverSidebar, setMouseOverSidebar] = useState(false);
  const [openMasterMenu, setOpenMasterMenu] = useState(
    pathname?.includes("specialization") || pathname?.includes("rollmaster")
  );

  useEffect(() => {
    console.log("Current Pathname:", pathname);
  }, [pathname]);

  const handleMouseEnter = () => {
    setMouseOverSidebar(true);
  };

  const handleMouseLeave = () => {
    setMouseOverSidebar(false);
  };

  return (
    <div
      className={`sidebar ${isSidebarExpanded ? "" : "hidden"}`}
      id="sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Scrollbars
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        autoHeight
        autoHeightMin={0}
        autoHeightMax="95vh"
        thumbMinSize={30}
        universal={false}
        hideTracksWhenNotNeeded={true}
      >
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Main</span>
              </li>

              <li className={pathname === "/admin/superultradashboard" ? "active" : ""}>
                <Link to="/admin/superultradashboard">
                  <i className="fe fe-home"></i>
                  <span>Dashboard</span>
                </Link>
              </li>

              <li className={pathname === "/superultraadmin/ultrahospital" ? "active" : ""}>
                <Link to="/superultraadmin/ultrahospital">
                  <i className="fe fe-activity"></i>
                  <span>Hospital</span>
                </Link>
              </li>

              {/* Master Menu with Submenu */}
              <li className={`submenu ${openMasterMenu ? "open" : ""}`}>
                <a href="#!" onClick={() => setOpenMasterMenu(!openMasterMenu)}>
                  <i className="fe fe-activity"></i>
                  <span>Master</span>
                  <span className="menu-arrow"></span>
                </a>
                <ul style={{ display: openMasterMenu ? "block" : "none" }}>
                  <li>
                    <Link
                      to="/admin/Specialization"
                      className={pathname?.includes("specialization") ? "active" : ""}
                    >
                      <i className="fe fe-document"></i>
                      <span>Specialization</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/rollmaster"
                      className={pathname?.includes("rollmaster") ? "active" : ""}
                    >
                      <i className="fe fe-table"></i>
                      <span>Role</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
};

export default SidebarultraNav;

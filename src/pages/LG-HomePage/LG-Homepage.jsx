import React from "react";
import './LG-Homepage.css';
import WebsiteNavbar from "../../components/HomePageComponents/WebsiteNavbar";
import LGSidebar from "../../components/LocalGuide/LG-Sidebar";

function LgHomepage (){
    return(
        <>
        <WebsiteNavbar/>
        <LGSidebar/>
        </>
    );
}
export default LgHomepage;
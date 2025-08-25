
import { ReactNode } from "react";
import './Layout.scss'
import TitleBar from "./TitleBar";
import SideBar from "./SideBar";

interface Props {
    children: ReactNode;
}

function Layout({ children }: Props) {
    return (
        <div className="general-container">
            <TitleBar/>
            <div className="general-content">
                <SideBar />

                {/* Main Content */}
                {/* Todo: ver si main-content es necesario*/}
                <div className="main-content overflow-scroll">

                    {/* Todo: ver si esta clase es necesaria */}
                    <main className="notes-container">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Layout;

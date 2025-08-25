
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
                <div className="main-content overflow-scroll">
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Layout;

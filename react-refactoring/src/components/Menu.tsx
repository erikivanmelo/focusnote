import React, { useEffect, useState } from "react";

function Menu() {
    return (
        <>
            <Navbar title="Focusnote" />
            <Modal id="wit" title="About">
                <p>
                    <b>FocusNote</b> is a minimalistic web application designed for quick and
                    simple note-taking. Inspired by the simplicity of platforms like Twitter,
                    FocusNote allows users to record notes, track project progress, and document
                    learnings related to the world of software—all within a clean and focused
                    interface.
                </p>

                <p>
                    This project was initially created as a personal tool to organize ideas and
                    keep a daily log of studies and projects. What started as a hobby has evolved
                    into a practical way to maintain a history of knowledge and tasks.
                </p>
                <p>
                    FocusNote prioritizes simplicity and ease of use, making it the perfect
                    solution for those seeking a lightweight and efficient method to manage their
                    notes.
                </p>
            </Modal>
        </>
    );
}


interface ModalProps {
    id: string;
    title: string;
    children: React.ReactNode;
}

function Modal({ id, title, children }: ModalProps) {
    return (
        <div
            className="modal fade"
            id={id}
            tabIndex={-1}
            aria-labelledby={`${id}Label`}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>
                            {title}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );
}


interface NavbarProps {
    title: string;
}

function Navbar({ title }: NavbarProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    // Manejar el modo oscuro utilizando useEffect
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm w-100 fixed-top">
                <span id="page-title" className="order-1 order-lg-0 ms-lg-0 ms-auto me-auto">
                    <a className="navbar-brand" href="#">
                        {title}
                    </a>
                </span>

                <button
                    className="navbar-toggler bg-light mobileButtonMenu align-self-start btn fs-1"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="bi bi-list"></span>
                </button>

                <div
                    className={`collapse navbar-collapse d-flex bg-light flex-column flex-lg-row flex-xl-row justify-content-lg-end p-3 p-lg-0 mt-5 mt-lg-1 mobileMenu  ${
                        isOpen && "open"
                    }`}
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav align-self-stretch">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">
                                Home <span className="visually-hidden">(current)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                data-bs-toggle="modal"
                                data-bs-target="#wit"
                                href="#"
                            >
                                About
                            </a>
                        </li>
                    </ul>
                    <label className="switch ms-lg-auto">
                        <input
                            type="checkbox"
                            checked={isDarkMode}
                            onChange={() => setIsDarkMode(!isDarkMode)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </nav>
            <span
                className={`overlay  ${isOpen && "open"}`}
                onClick={() => setIsOpen(!isOpen)}
            ></span>
        </>
    );
}

export default Menu;

import React, { useState, useEffect, useContext } from "react";
import { getUsuarioFromLocalStorage } from "../../request/UsuarioApi";
import imgLogo from "../../imgs/undraw_profile.svg";
import chatIcon from "../../imgs/chat_icon.png"; // Adicione sua imagem do chat aqui
import ChatPopup from "./chat/ChatPopup";
import { ContextLogin } from "../../context/LoginContext";

const Topbar = () => {
  const usuario = getUsuarioFromLocalStorage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Controle de exibição do popup
  const { logout } = useContext(ContextLogin);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest("#userDropdownMenu") &&
        !event.target.closest("#userDropdown")
      ) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item d-flex align-items-center justify-content-center">
          <img
            src={chatIcon}
            alt="Chat Icon"
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
            }}
            onClick={toggleChat}
          />
        </li>
        {isDropdownOpen ? (
          <li className="nav-item dropdown" id="userDropdownMenu">
            <div
              className="dropdown-menu-end shadow animated--fade-in bg-light mt-5"
              style={{ width: "200px" }}
            >
              <h6 className="dropdown-header d-flex align-items-center m-0 pl-2">
                <img
                  className="rounded-circle mr-2"
                  style={{ width: "40px", height: "40px" }}
                  src={imgLogo}
                  alt="User avatar"
                />
                <div className="p-0 m-0">
                  <div className="fw-bold p-0 m-0">
                    {usuario ? usuario.usuario.nome : "Desconhecido"}
                  </div>
                  <div className="text-truncate small p-0 m-0">
                    {usuario ? usuario.usuario.usuario : "Desconhecido"}
                  </div>
                </div>
              </h6>
              <div className="dropdown-divider p-0 m-0" />
              <a
                className="dropdown-item pl-2 m-0 h6 text-danger font-weight-bold text-center"
                onClick={logout}
              >
                <small className="font-weight-bold text-center">Logout</small>
              </a>
            </div>
          </li>
        ) : (
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              id="userDropdown"
              onClick={toggleDropdown}
            >
              <div className="d-flex align-items-center">
                <img
                  className="rounded-circle"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                  }}
                  src={imgLogo}
                  alt="User profile"
                />
                <span className="d-none d-lg-inline text-gray-600 small">
                  {usuario ? usuario.usuario.nome : "Desconhecido"}
                </span>
              </div>
            </a>
          </li>
        )}
      </ul>
      <ChatPopup isChatOpen={isChatOpen} toggleChat={toggleChat} />
    </nav>
  );
};

export default Topbar;

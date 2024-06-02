// src/views/LandingPage.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import * as XLSX from "xlsx/xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import { saveAs } from "file-saver";

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  background: #f5f5f5;
  text-align: center;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 3em;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.2em;
  color: #666;
  margin: 20px 0;
  max-width: 600px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LogoutButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const ContactsContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
`;

const ContactItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #333;

  &:last-child {
    border-bottom: none;
  }
`;

const ContactName = styled.div`
  font-weight: bold;
`;

const ContactInfo = styled.div`
  color: #666;
`;

const PaginationContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaginationButton = styled.button`
  background-color: #ddd;
  color: black;
  border: 2px solid black;
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;

  &:hover {
    border: 2px solid black;
    text-decoration: underline;
  }
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
    border: none;
  }
`;

const Divider = styled.hr`
  border-top: 8px solid black;
  border-radius: 5px;
`;

function LandingPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 100;

  const login = useGoogleLogin({
    onSuccess: (res) => {
      setUser(res);
      toast.success("You successfully logged in", {
        position: "top-left",
        theme: "dark",
        autoClose: 2000,
      });
    },
    onError: (error) => {
      console.log("Login Failed:", error);
      toast.error("Login Failed!", {
        position: "top-left",
        theme: "dark",
        autoClose: 2000,
      });
    },
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/contacts.readonly",
  });

  const fetchContacts = async (accessToken) => {
    let allContacts = [];
    let nextPageToken = null;

    try {
      do {
        const result = await axios.get(
          `https://people.googleapis.com/v1/people/me/connections`,
          {
            params: {
              personFields: "names,phoneNumbers",
              pageToken: nextPageToken,
              pageSize: 100,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const contacts = result.data.connections || [];
        allContacts = allContacts.concat(contacts);
        nextPageToken = result.data.nextPageToken;
      } while (nextPageToken);

      return allContacts;
    } catch (error) {
      console.error("Error fetching contacts: ", error);
      return [];
    }
  };

  useEffect(() => {
    if (user && user.access_token) {
      const fetchUserInfo = async () => {
        try {
          const userInfo = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
              },
            }
          );

          setProfile(userInfo.data);

          const userContacts = await fetchContacts(user.access_token);
          console.log("Fetched Contacts: ", userContacts);
          setContacts(userContacts);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUserInfo();
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUser(null);
    toast.success("You have been logged out!", {
      position: "top-left",
      theme: "dark",
      autoClose: 2000,
    });
  };

  const downloadContacts = () => {
    const contactData = contacts.map((contact) => ({
      Name: contact.names?.[0]?.displayName || "No Name",
      Phone: contact.phoneNumbers?.[0]?.value || "No Phone",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(contactData);
    XLSX.utils.book_append_sheet(wb, ws, "ContactsSheet");
    const blob = XLSX.write(wb, { bookType: "xlsx", type: "base64" });

    saveAs(blob, "contacts.xlsx");
  };

  const totalContacts = contacts.length;
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  return (
    <>
      <LandingContainer>
        <Header>Welcome to G-Insight</Header>
        <Description>
          Discover what information Google stores about you. Log in with your
          Google account to view your photos, contacts, emails, logged-in sites,
          location, and more.
        </Description>
        <ButtonContainer>
          {profile ? (
            <>
              <img src={profile.picture} alt="Profile" />
              <h2>
                Hi 👋
                <br /> {profile.name}
              </h2>
              <b>
                ---------------------------------------------------------------
              </b>
              <div>
                <p>
                  Total contacts: <b>{totalContacts}</b>
                </p>
                <button className="Button" onClick={downloadContacts}>
                  Download All Contacts⬇️
                </button>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <button
                  className="Button"
                  onClick={() => setShowAllContacts(!showAllContacts)}
                >
                  {showAllContacts ? "Show Paginated" : "Show All"}
                </button>
              </div>
              <ContactsContainer>
                {showAllContacts ? (
                  <>
                    {/* <h3>Your Contacts:</h3> */}
                    <ul>
                      {contacts.map((contact, index) => (
                        <ContactItem key={index}>
                          <ContactName>
                            {contact.names?.[0]?.displayName || "No Name"}
                          </ContactName>
                          <ContactInfo>
                            {contact.phoneNumbers?.[0]?.value || "No Phone"}
                          </ContactInfo>
                        </ContactItem>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <ul>
                      {currentContacts.map((contact, index) => (
                        <ContactItem key={index}>
                          <ContactName>
                            {contact.names?.[0]?.displayName || "No Name"}
                          </ContactName>
                          <ContactInfo>
                            {contact.phoneNumbers?.[0]?.value || "No Phone"}
                          </ContactInfo>
                        </ContactItem>
                      ))}
                    </ul>
                    {contacts.length > contactsPerPage && (
                      <PaginationContainer>
                        <PaginationButton
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </PaginationButton>
                        <span>{currentPage}</span>
                        <PaginationButton
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={indexOfLastContact >= totalContacts}
                        >
                          Next
                        </PaginationButton>
                      </PaginationContainer>
                    )}
                  </>
                )}
              </ContactsContainer>
            </>
          ) : (
            <button className="Button" onClick={login}>
              Sign in with Google 🚀
            </button>
          )}
        </ButtonContainer>
        {profile && (
          <LogoutButtonContainer>
            <button className="Button logoutbutton" onClick={logOut}>
              Log out
            </button>
          </LogoutButtonContainer>
        )}
        <ToastContainer />
      </LandingContainer>
    </>
  );
}

export default LandingPage;

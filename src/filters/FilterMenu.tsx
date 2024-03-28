import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { IAuthor, ILocation } from "../utils/api";

interface FilterMenuProps {
  isVisible: boolean;
  onHide: () => void;
  artists: IAuthor[] | undefined;
  locations: ILocation[] | undefined;
  onApplyFilters: (
    selectedArtist: IAuthor | null,
    selectedLocation: ILocation | null,
    fromYear: string,
    toYear: string
  ) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  onApplyFilters,
  isVisible,
  onHide,
  artists,
  locations,
}) => {
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const [selectedArtist, setSelectedArtist] = useState<IAuthor | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(
    null
  );
  const [isArtistSectionVisible, setArtistSectionVisible] = useState(true);
  const [isLocationSectionVisible, setLocationSectionVisible] = useState(true);
  const [isYearSectionVisible, setYearSectionVisible] = useState(true);
  const [filteredArtists, setFilteredArtists] = useState<IAuthor[]>(
    artists || []
  );
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>(
    locations || []
  );
  const [location, setLocation] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [isArtistDropdownVisible, setIsArtistDropdownVisible] = useState(false);
  const [isLocationDropdownVisible, setIsLocationDropdownVisible] =
    useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)
      ) {
        setIsArtistDropdownVisible(false);
        setIsLocationDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredLocations(locations || []);
  }, [locations]);

  const toggleArtistSection = () => {
    setArtistSectionVisible(!isArtistSectionVisible);
  };

  const toggleLocationSection = () => {
    setLocationSectionVisible(!isLocationSectionVisible);
  };

  const toggleYearSection = () => {
    setYearSectionVisible(!isYearSectionVisible);
  };

  const handleResetClick = () => {
    setInputValue("");
    setSelectedArtist(null);
    setSelectedLocation(null);
    setLocation("");
    setFilteredArtists(artists || []);
    setFilteredLocations(locations || []);
    setFromYear("");
    setToYear("");
    setIsArtistDropdownVisible(false);
    setIsLocationDropdownVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const filtered =
      artists?.filter((artist) =>
        artist.name.toLowerCase().includes(value.toLowerCase())
      ) || [];
    setFilteredArtists(filtered);
    setIsArtistDropdownVisible(true);
  };

  const handleArtistSelect = (artist: IAuthor) => {
    setInputValue(artist.name);
    setSelectedArtist(artist);
    setIsArtistDropdownVisible(false);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    const filtered =
      locations?.filter((location) =>
        location.location.toLowerCase().includes(value.toLowerCase())
      ) || [];
    setFilteredLocations(filtered);
    setIsLocationDropdownVisible(true);
  };

  const handleLocationSelect = (location: ILocation) => {
    setLocation(location.location);
    setSelectedLocation(location);
    setIsLocationDropdownVisible(false);
  };

  if (!isVisible || !artists || !locations) {
    return null;
  }

  return (
    <Col xs={12} sm={3} md={2} lg={2} className="filter-menu-column">
      <div className="filter-menu-close-btn" onClick={onHide}>
        X
      </div>
      <div className="group">
        <div
          className={`form-group ${isArtistSectionVisible ? "" : "minus"}`}
          onClick={toggleArtistSection}
        >
          ARTIST
        </div>
        {isArtistSectionVisible && (
          <Form.Group>
            <div className="dropdown-container" ref={dropdownRef}>
              <Form.Control
                className="dropdown-filter"
                as="input"
                type="text"
                placeholder="Enter artist name"
                value={inputValue}
                onChange={handleInputChange}
                onClick={() => setIsArtistDropdownVisible(true)}
              />
              {isArtistDropdownVisible && (
                <div className="dropdown-results">
                  {filteredArtists.length === 0 ? (
                    <div className="no-results-message">
                      No matching results
                    </div>
                  ) : (
                    filteredArtists.map((artist) => (
                      <div
                        key={artist.id}
                        onClick={() => handleArtistSelect(artist)}
                        className="dropdown-element"
                      >
                        {artist.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Form.Group>
        )}
      </div>
      <div className="group">
        <div
          className={`form-group ${isLocationSectionVisible ? "" : "minus"}`}
          onClick={toggleLocationSection}
        >
          LOCATION
        </div>
        {isLocationSectionVisible && (
          <Form.Group>
            <div className="dropdown-container" ref={dropdownRef}>
              <Form.Control
                className="dropdown-filter"
                as="input"
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={handleLocationChange}
                onClick={() => setIsLocationDropdownVisible(true)}
              />
              {isLocationDropdownVisible && (
                <div className="dropdown-results">
                  {filteredLocations.length === 0 ? (
                    <div className="no-results-message">
                      No matching results
                    </div>
                  ) : (
                    filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className="dropdown-element"
                      >
                        {location.location}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Form.Group>
        )}
      </div>
      <div className="group">
        <div
          className={`form-group ${isYearSectionVisible ? "" : "minus"}`}
          onClick={toggleYearSection}
        >
          YEARS
        </div>
        {isYearSectionVisible && (
          <Row className="year-range">
            <Col>
              <Form.Control
                type="text"
                placeholder="From"
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
              />
            </Col>
            <div className="dash">—</div>
            <Col>
              <Form.Control
                type="text"
                placeholder="To"
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
              />
            </Col>
          </Row>
        )}
      </div>

      <div className="my-container">
        <Button
          className="my-button"
          onClick={() => {
            onHide(); 
            onApplyFilters(selectedArtist, selectedLocation, fromYear, toYear); 
          }}
        >
          SHOW THE RESULTS
        </Button>
        <Button className="my-button" onClick={handleResetClick}>
          CLEAR
        </Button>
      </div>
    </Col>
  );
};

export default FilterMenu;

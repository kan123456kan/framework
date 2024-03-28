import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Navbar,
  Container,
  Button,
  Form,
  FormControl,
  Row,
  Col,
  Card,
  Pagination,
} from "react-bootstrap";

import {
  api,
  IPaintingsResponse,
  IAuthor,
  base_url,
  ILocation,
} from "./utils/api";

import { toggleTheme, Theme } from "utils/themeManager";
import FilterMenu from "./filters/FilterMenu";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.scss";
import "./styles/themes/light.module.scss";
import "./styles/themes/dark.module.scss";

const App: React.FC = () => {
  // theme
  const [isDarkTheme, setDarkTheme] = useState(false);
  const [allPaintings, setAllPaintings] = useState<
    IPaintingsResponse[] | undefined
  >([]);

  const toggleAndChangeIcon = () => {
    toggleTheme();
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setDarkTheme(currentTheme === Theme.Light);
  };

  // input
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClearClick = () => {
    setSearchValue("");
  };

  // api, pagination
  const [, setPaintings] = useState<IPaintingsResponse[] | undefined>([]);
  const [filteredPaintings, setFilteredPaintings] = useState<
    IPaintingsResponse[] | undefined
  >([]);
  const [authors, setAuthors] = useState<IAuthor[] | undefined>([]);
  const [locations, setLocations] = useState<ILocation[] | undefined>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let paintingsData;
        if (searchValue.trim() !== "") {
          paintingsData = await api.paintings(searchValue, currentPage);
        } else {
          paintingsData = await api.paintings("", currentPage);
        }
        setPaintings(paintingsData);
        setAllPaintings(paintingsData);

        setFilteredPaintings(paintingsData);

        const authorsData = await api.authors();
        setAuthors(authorsData);

        const locationsData = await api.locations();
        setLocations(locationsData);
      } catch (error) {
        console.error("Ошибка при запросе к API:", error);
      }
    };

    fetchData();
  }, [currentPage, searchValue]);

  const getAuthorName = (authorId: number): string => {
    const author = authors?.find((a) => a.id === authorId);
    return author?.name || "Неизвестный художник";
  };

  const getLocationName = (locationId: number): string => {
    const location = locations?.find((loc) => loc.id === locationId);
    return location?.location || "Неизвестное место";
  };

  // pagination

  const totalItemsPerPage = 1;
  const totalPages = Math.ceil((allPaintings?.length ?? 0) / totalItemsPerPage);

  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    const addPageNumbers = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    };

    if (currentPage <= 3) {
      addPageNumbers(1, Math.min(4, totalPages));
      if (totalPages > 4) {
        pageNumbers.push("...");
        addPageNumbers(totalPages, totalPages);
      }
    } else if (totalPages - 1 && totalPages > 3) {
      addPageNumbers(1, Math.min(1, totalPages));
      pageNumbers.push("...");
      addPageNumbers(totalPages - 3, totalPages);
    } else {
      addPageNumbers(1, 1);
      pageNumbers.push("...");
      addPageNumbers(currentPage - 1, currentPage);
    }

    return pageNumbers;
  };

  //filter

  const [isFilterMenuVisible, setFilterMenuVisible] = useState<boolean>(false);

  const handleFilterButtonClick = () => {
    setFilterMenuVisible((prevVisible) => !prevVisible);
  };

  const handleApplyFilters = (
    selectedArtist: IAuthor | null,
    selectedLocation: ILocation | null,
    fromYear: string,
    toYear: string
  ) => {
    const filtered = allPaintings?.filter((painting: IPaintingsResponse) => {
      const matchesArtist =
        !selectedArtist || painting.authorId === selectedArtist.id;
      const matchesLocation =
        !selectedLocation || painting.locationId === selectedLocation.id;
      const matchesYear =
        (!fromYear || parseInt(painting.created) >= parseInt(fromYear)) &&
        (!toYear || parseInt(painting.created) <= parseInt(toYear));
      return matchesArtist && matchesLocation && matchesYear;
    });

    setFilteredPaintings(filtered);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand>
            <img
              src={
                isDarkTheme
                  ? "/assets/images/logo_light.svg"
                  : "/assets/images/logo_dark.svg"
              }
              alt=""
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar" className="justify-content-end">
            <Button variant="link" onClick={toggleAndChangeIcon}>
              <img
                src={
                  isDarkTheme
                    ? "/assets/images/dark_btn.svg"
                    : "/assets/images/light_btn.svg"
                }
                alt=""
              />
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4 search">
        <Row className="justify-content-end">
          <Col xs={9} sm={6} md={4} lg={3}>
            <Form className="search-form">
              <div className="mb-3 position-relative">
                <FormControl
                  type="text"
                  placeholder="Поиск"
                  className="search-input"
                  value={searchValue}
                  onChange={handleInputChange}
                />
                {searchValue && (
                  <Button
                    variant="link"
                    className="clear-button"
                    onClick={handleClearClick}
                  >
                    &times;
                  </Button>
                )}
              </div>
            </Form>
          </Col>

          <Col xs={12} sm={2} md={2} lg={1}>
            <Button
              variant="link"
              className="button_filter"
              onClick={handleFilterButtonClick}
            >
              <img
                src={
                  isDarkTheme
                    ? "/assets/images/filter_light.svg"
                    : "/assets/images/filter_dark.svg"
                }
                alt=""
              />
            </Button>
          </Col>
        </Row>

        <FilterMenu
          isVisible={isFilterMenuVisible}
          onHide={() => setFilterMenuVisible(false)}
          artists={authors}
          locations={locations}
          onApplyFilters={handleApplyFilters}
        />

        <Row>
          {filteredPaintings && filteredPaintings.length > 0 ? (
            filteredPaintings?.map((painting, index) => (
              <Col key={index} xl={4} xs={12} sm={6} md={4} lg={4}>
                <div className="custom-card-container">
                  <div className="custom-card">
                    <div className="image-container">
                    <Card.Img
                  variant="top"
                  src={base_url + painting.imageUrl}
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    e.currentTarget.src =
                      "https://avatars.mds.yandex.net/get-mpic/1626700/img_id5550329233255757547.jpeg/orig"; // Заглушка для изображения с ошибкой
                    const errorText = document.createElement('span'); // Создаем элемент span для текста ошибки
                    errorText.textContent = 'Извините, картина не загрузилась, попробуйте перезагрузить страницу'; // Устанавливаем текст для элемента span
                    errorText.style.position = 'absolute'; // Устанавливаем абсолютное позиционирование
                    errorText.style.bottom = '5px'; // Устанавливаем отступ от нижнего края изображения
                    errorText.style.left = '5px'; // Устанавливаем отступ от левого края изображения
                    errorText.style.color = 'red'; // Устанавливаем цвет текста
                    errorText.style.top = '5px';
                    e.currentTarget.parentNode?.appendChild(errorText); // Добавляем элемент span после изображения
                  }}
                />
                      <div className="text">
                        <div className="color-bar"></div>
                        <div className="text-container">
                          <p className="card-title">{painting.name}</p>
                          <p className="card-text">{painting.created}.</p>
                        </div>
                        <div className="additional-info">
                          <p className="artist-name">
                            {getAuthorName(painting.authorId)}
                          </p>
                          <p className="location">
                            {getLocationName(painting.locationId)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <Row className="input_search mt-4">
              <Col>
                <h1>No matches for {searchValue}</h1>
                <p>Please try again with a different spelling or keywords.</p>
              </Col>
            </Row>
          )}
        </Row>

        {filteredPaintings && filteredPaintings.length > 0 && (
          <Row className="justify-content-center mt-4">
            <Pagination className="custom-pagination">
              <Pagination.Prev
                className="pagination-item arrow"
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
              />
              {generatePageNumbers().map((pageNumber, index) => (
                <Pagination.Item
                  key={index}
                  className={`pagination-item ${currentPage === pageNumber ? "active" : ""}`}
                  onClick={() => {
                    if (typeof pageNumber === "number") {
                      setCurrentPage(pageNumber);
                    }
                  }}
                >
                  {pageNumber}
                </Pagination.Item>
              ))}
              <Pagination.Next
                className="pagination-item arrow"
                onClick={() =>
                  setCurrentPage((prevPage) =>
                    Math.min(prevPage + 1, totalPages)
                  )
                }
              />
            </Pagination>
          </Row>
        )}
      </Container>
    </>
  );
};

export default App;

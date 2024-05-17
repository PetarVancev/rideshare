import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import SearchRideCard from "./SearchRideCard";

const Home = () => {
  const today = new Date();
  const initials = {
    fromId: null,
    fromLocName: null,
    toId: null,
    toLocName: null,
    date: today,
    seats: 1,
  };

  return (
    <>
      <div className="home-background">
        <NavBar type="blue" />
        <BottomBar />
        <Container className="home-container d-flex flex-column align-items-center">
          <div className="mt-5">
            <h2 className="heading-s white-text">
              Која е твојата следна дестинација?
            </h2>
            <p className="body-xs white-text">
              Најди го твојот најевтин и најбрз превоз до посакуваната
              дестинација
            </p>
            <img
              src="images/cta-underline-green.svg"
              className="cta-underline"
            />
          </div>
          <SearchRideCard initials={initials} />
        </Container>
      </div>
      <Container className="home-container1">
        <Row>
          <Col xs={12} xl={4} className="mb-4">
            <img src="images/divide-icon.svg" className="mb-1 icon" />
            <h4 className="heading-xxs">
              Сподели превоз,патувај по најниски цени
            </h4>
            <p className="body-s blue-text">
              Со нас, патувањето е поефтино и поефикасно. Објавете го вашето
              патување или приклучете се на веќе објавено патување и заштедете
              пари. Нашата апликација ви овозможува лесно да најдете превоз до
              вашата дестинација и да ги поделите трошоците со другите патници.
              Време е да ги намалите трошоците за патување и да уживате во
              удобноста на споделениот превоз.
            </p>
          </Col>
          <Col xs={12} xl={4} className="mb-4">
            <img src="images/shield-icon.svg" className="mb-1 icon" />
            <h4 className="heading-xxs">Сигурноста ни е на прво место</h4>
            <p className="body-s blue-text">
              Вашата сигурност и безбедност се наш приоритет. Сите наши возачи и
              патници се проверуваат и оценуваат за да ви обезбедиме највисоко
              ниво на сигурност. Со нашата апликација, можете да го проверите
              профилот и рејтингот на возачите и патниците пред да се приклучите
              на патувањето. Ве охрабруваме да оставите повратни информации за
              вашето искуство за да ја одржиме заедницата безбедна и доверлива.
            </p>
          </Col>
          <Col xs={12} xl={4} className="mb-4">
            <img src="images/dollar-icon.svg" className="mb-1 icon" />
            <h4 className="heading-xxs">Плаќање со картичка или во кеш</h4>
            <p className="body-s blue-text">
              Нашата платформа ви овозможува да изберете помеѓу плаќање со
              картичка или во кеш. Доколку претпочитате брзо и сигурно плаќање,
              користете ја вашата картичка преку нашата апликација. За оние кои
              претпочитаат кеш, можете да го договорите плаќањето директно со
              возачот. Ние ја правиме секоја трансакција лесна и безбедна за
              сите корисници.
            </p>
          </Col>
        </Row>
      </Container>
      <div className="pt-5 pb-5 blue-background">
        <div className="text-center desktop-hide">
          <img src="images/home-photo1.png" className="home-section-img" />
        </div>
        <Container>
          <Row>
            <Col xs={12} xl={6}>
              <h4 className="heading-m white-text mt-4 mb-3">За нас</h4>
              <p className="body-s white-text mb-4">
                Ние сме тим кој со страст и посветеност работи на тоа да го
                направиме патувањето поефтино, поудобно и попријатно за сите.
                Нашата идеја е да ви овозможиме да ги споделите трошоците за
                патувањето со други патници кои патуваат во истиот правец,
                создавајќи еден поекономичен и поодржлив начин на транспорт.{" "}
                <br /> <br /> Зад овој проект стоиме ние, тим од трojца основачи
                и голем тим на поддржувачи. Особена благодарност им изразуваме
                на сите наши поддржувачи, кои со својата посветеност и верба во
                нашата идеја придонесоа да станеме тоа што сме денес. <br />{" "}
                <br /> Ве покануваме да станете дел од нашата заедница и да ги
                искусите придобивките од споделувањето на превозот.
              </p>
              <button
                className="green-button"
                onClick={() => (window.location.href = "/about-us")}
              >
                Прочитај повеќе
              </button>
            </Col>
            <Col xs={12} xl={6} className="d-flex mobile-hide">
              <img
                src="images/home-photo1-desktop.png"
                className="home-section-img2"
              />
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="pt-5 pb-5">
        <Row>
          <Col xs={12} xl={6}>
            <div className="home-img-container">
              <img src="images/home-photo2.jpg" className="home-section-img" />
            </div>
          </Col>
          <Col xs={12} xl={6}>
            <h4 className="heading-m mt-4 mb-3">Заштедете додека возите</h4>
            <p className="body-s blue-text mb-4">
              Секое место во вашиот автомобил е можност за заштеда и за ново
              пријателство. Со секој патник кој ќе се приклучи на вашето
              патување, вашите трошоци се намалуваат, а патувањето станува
              попријатно и поинтересно.
            </p>
            <button
              className="green-button"
              onClick={() => (window.location.href = "/post-ride")}
            >
              Објавете превоз
            </button>
          </Col>
        </Row>
      </Container>
      <footer className="text-center card-payment-info pt-4 pb-4">
        <img src="images/visa-secure-icon.png" className="me-2" />
        <img src="images/mastercard-secure-icon.png" className="ms-2" />
        <p className="text-center body-xs mt-2">
          Сите ваши трансакции се сигурни со нашата заштита, а истото важи и за
          податоците што ги внесувате при резервирање.
        </p>
        <div className="text-center body-xs mt-2">
          <a>Политика на приватност</a> | © rideshare 2024
        </div>
      </footer>
    </>
  );
};

export default Home;

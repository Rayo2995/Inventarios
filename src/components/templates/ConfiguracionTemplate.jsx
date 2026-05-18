import React from "react";
import styled from "styled-components";
import fondocuadros from "../../assets/fondocuadros.svg";
import { Link } from "react-router-dom";
import { DataModulosConfiguracion } from "../../utils/dataEstatica";
import { Mensaje } from "../moleculas/Mensaje";

export function ConfiguracionTemplate() {
  // Efecto para seguimiento del mouse (opcional)
  const handleMouseMove = (e) => {
    const cards = document.getElementById("cards");
    if (!cards) return;

    const rect = cards.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cards.style.setProperty("--mouse-x", `${x}px`);
    cards.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <Container onMouseMove={handleMouseMove}>
      <Title>Panel de Configuración</Title>
      <Subtitle>Gestiona los diferentes aspectos de tu sistema</Subtitle>

      <CardsWrapper id="cards">
        {DataModulosConfiguracion.map((item, index) => (
          <Card
            to={item.state ? item.link : "#"}
            className={item.state ? "card" : "card disabled"}
            key={index}
            onClick={(e) => !item.state && e.preventDefault()}
          >
            <Mensaje state={item.state}/>
            <div className="card-content">
              <div className="card-image">
                <img src={item.icono} alt={item.title} />
              </div>
              <div className="card-info-wrapper">
                <div className="card-info">
                  <div className="card-info-title">
                    <h3>{item.title}</h3>
                    <h4>{item.subtitle}</h4>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardsWrapper>
    </Container>
  );
}

// --- STYLED COMPONENTS ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: ${({ theme }) => theme.bgtotal};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #484848;
    border-radius: 10px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colortitlecard};
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colorsubtitlecard};
  text-align: center;
  max-width: 600px;
  margin-bottom: 40px;
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1000px;
  justify-content: center;
  width: 100%;
`;

const Card = styled(Link)`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 300px;
  height: 260px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    border: 1px solid #3498db;
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);

    .card-image img {
      filter: grayscale(0);
      transform: scale(1.05);
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;

    &:hover {
      border: 1px solid #e74c3c;
      transform: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .card-content {
    background-color: ${({ theme }) => theme.bgcards}; /* cambia según el theme */
    border-radius: inherit;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 10px; /* tamaño original */
    position: absolute;
    inset: 1px;
    z-index: 2;
  }


  .card-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
    margin-bottom: 15px;

    img {
      height: 70%;
      max-width: 100%;
      object-fit: contain;
      filter: grayscale(100%);
      transition: all 0.3s ease;
    }
  }

  .card-info-wrapper {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: flex-start;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    width: 100%;
  }

  .card-info-title h3 {
    font-size: 1.2em;
     color: ${({ theme }) => theme.colorsubtitlecard};
    margin-bottom: 5px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .card-info-title h4 {
    font-size: 0.9em;
    color: #7f8c8d;
    font-weight: 400;
  }

  @media (max-width: 500px) {
    height: 180px;
    .card-image {
      height: 80px;
    }
    .card-info-title h3 {
      font-size: 1em;
    }
    .card-info-title h4 {
      font-size: 0.8em;
    }
  }

  @media (max-width: 320px) {
    width: 100%;
  }
`;

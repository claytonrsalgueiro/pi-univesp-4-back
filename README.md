# 🌦️ Weather — Sistema de Análise Meteorológica e Processamento de Dados em Larga Escala

O **Weather** é um sistema completo de **análise meteorológica** e **processamento massivo de dados** coletados por **estações IoT**.  
Ele permite o **upload de arquivos de telemetria (.dat / TOA5)**, processa os dados no **backend Spring Boot 3**, armazena em **MySQL**, e exibe gráficos e estatísticas interativas no **frontend React + PrimeReact + Next.js**.

---

## 🚀 Arquitetura Geral

| Camada | Tecnologia | Descrição |
|--------|-------------|-----------|
| **Backend (API)** | Java 17 + Spring Boot 3.3 | Processamento e análise de dados meteorológicos, upload de arquivos `.dat`, geração de relatórios (médias, totais e gráficos). |
| **Banco de Dados** | MySQL 8 | Armazenamento dos registros processados (temperatura, vento, umidade, precipitação, etc.). |
| **Frontend (Web)** | React 18 + Next.js 14 + PrimeReact 10 | Interface web interativa para upload, visualização em tabela e gráficos dinâmicos (Chart.js). |
| **Autenticação** | Basic Auth | Autenticação simples (`admin` / `123456`) para desenvolvimento local. |

---

## 🧩 Tecnologias Utilizadas

### 🖥️ Backend
- **Java 17**
- **Spring Boot 3.3**
- **Spring Web**
- **Spring Data JPA / Hibernate**
- **MySQL Connector/J**
- **Lombok**
- **Jakarta Validation**
- **Jackson Databind**
- **Maven Wrapper**
- **Tomcat embutido (porta 8090)**

---

### 💻 Frontend
- **React 18.2.0**
- **Next.js 14.x**
- **PrimeReact 10.x**
- **PrimeFlex / PrimeIcons**
- **TypeScript**
- **TailwindCSS**
- **Chart.js / PrimeReact Chart**
- **xior (cliente HTTP customizado)**
- **Node.js >= 18**
- **NPM >= 9**

---

## ⚙️ Configuração do Ambiente Backend

### 🗄️ Arquivo `application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/meteo?useSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=UTC
    username: root
    password: root123
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        jdbc:
          batch_size: 1000
        order_inserts: true
        order_updates: true
  servlet:
    multipart:
      max-file-size: 512MB
      max-request-size: 512MB

server:
  port: 8090

auth:
  username: admin
  password: 123456

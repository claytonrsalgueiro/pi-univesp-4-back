# 🌦️ Weather — Sistema de Análise Meteorológica e Processamento de Dados em Larga Escala

O **Weather** é um sistema completo de **análise meteorológica** e **processamento massivo de dados** coletados por **estações IoT**.  
Ele permite o **upload de arquivos de telemetria (.dat / TOA5)**, processa os dados no **backend Spring Boot 3**, armazena em **MySQL**, exibe gráficos e estatísticas interativas no **frontend React + PrimeReact + Next.js** e principalmente exporta os dados em arquivos excel para processsamento e análises internas um em sistema externos que necessita dessas informações previamente processados em média por período (exibindo as médias por dia) ou hora a hora de um determinado dia .

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
```

---

## 🐳 Docker Compose (MySQL)

Crie o arquivo **`docker-compose.yml`** na raiz do projeto:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql-meteo
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: meteo
      MYSQL_USER: root
      MYSQL_PASSWORD: root123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

volumes:
  mysql_data:
```

### ▶️ Subir banco de dados:
```bash
docker-compose up -d
```

---

## 🧠 Execução do Backend

### Pré-requisitos
- **Java 17** instalado
- **Maven 3.9+**
- **MySQL 8** (local ou via Docker)

### Comandos

```bash
# na pasta do backend
mvn clean install
mvn spring-boot:run
```

A API iniciará em:
```
http://localhost:8090
```

Endpoints principais:
| Método | Endpoint | Descrição |
|---------|-----------|-----------|
| `POST` | `/api/weather/upload` | Upload e ingestão de arquivo `.dat` |
| `GET` | `/api/weather/summary` | Retorna médias e totais agregados |
| `GET` | `/api/weather/charts` | Dados consolidados para gráficos |
| `GET` | `/api/weather/export` | Exporta dados filtrados em Excel |

---

## 🌐 Frontend (Next.js + PrimeReact)

### Pré-requisitos
- **Node.js >= 18**
- **npm >= 9**
- (Opcional) **Docker** para subir o banco e o backend

### ⚙️ Arquivo `.env.local`
Crie na raiz do projeto **frontend**:

```env
SESSION_KEY="HM15snfT1Jy7hsxfjL5RXW43WSH/pZGthpKxO85b1hA="
API_URL="http://localhost:8090/api"
BASIC_USER="admin"
BASIC_PASS="123456"
```

---

### 🧩 Comandos

```bash
# instalar dependências
npm install

# rodar em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em:
```
http://localhost:3000/login
```

---

## 🔑 Acesso ao Sistema

| Campo | Valor |
|-------|-------|
| **URL de Login** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Usuário** | `admin` |
| **Senha** | `123456` |


### ⚙️ Arquivos .DAT usados como base para alimentação do banco de dados
https://github.com/claytonrsalgueiro/pi-univesp-4-back/tree/main/backend

Após subir o back e o front end e estar logado no sistema web, basta baixar esses 3 arquivos .dat e importá-los na tela http://localhost:3000/meteo utilizando o botão "Importar"

---



## 🧱 Estrutura de Pastas

```
/backend
 ├─ src/main/java/br/com/weather
 │   ├─ controller/
 │   ├─ service/
 │   ├─ dto/
 │   └─ domain/
 └─ resources/application.yml

/frontend
 ├─ app/
 │   ├─ (meteo)/             → Páginas principais (upload, tabela, gráficos)
 │   ├─ api/weather/         → Rotas internas (route.ts)
 │   └─ lib/                 → Session e auth
 ├─ public/
 │   └─ logo-weather.png
 ├─ package.json
 └─ .env.local
```

---

## 📊 Funcionalidades

✅ **Upload de arquivos meteorológicos (.dat / TOA5)**  
✅ **Processamento em massa via Spring Boot**  
✅ **Armazenamento em MySQL**  
✅ **Tabelas com médias diárias/horárias**  
✅ **Exportação para Excel**  
✅ **Gráficos dinâmicos (temperatura, vento, umidade, precipitação)**  
✅ **Hyetograma (chuva acumulada)**  
✅ **Autenticação básica (admin / 123456)**  
✅ **Layout responsivo com PrimeReact e TailwindCSS**

---

## ⚡ Portas Padrão

| Serviço | Porta | Descrição |
|----------|-------|-----------|
| **Frontend** | `3000` | Interface web (Next.js) |
| **Backend (API)** | `8090` | Spring Boot |
| **MySQL** | `3306` | Banco de dados |

---

## 🧑‍💻 Exemplos de Uso da API

### Upload de arquivo via cURL

```bash
curl -X POST "http://localhost:8090/api/weather/upload"   -u admin:123456   -F "file=@/caminho/do/arquivo.dat"
```

### Buscar resumo consolidado

```bash
curl -X GET "http://localhost:8090/api/weather/summary?start=2025-01-01&end=2025-01-31"   -u admin:123456
```

---

## 🛠️ Observações

- Este sistema foi projetado para uso **educacional e acadêmico**, demonstrando:
  - **Processamento em massa de dados IoT**
  - **Visualização interativa**
  - **Exportação e análise de dados**
- Pode ser facilmente adaptado para:
  - **Leitura em tempo real (MQTT, WebSocket)**
  - **Dashboards avançados (Grafana, Kibana, etc.)**

---

## 📸 Interface de Exemplo

**Tela de Gráficos (Hyetograma, Umidade, Vento, Temperatura)**  
![Exemplo Gráficos](docs/screenshot-graficos.png)

---

## 📦 Licença
MIT — uso livre para fins acadêmicos e comerciais com atribuição.

---

## ✨ Autor
**Desenvolvido pelo Grupo:** DRP03-PJI410-SALA-002GRUPO-013
📅 Projeto acadêmico PI 4 - Univesp — 2025

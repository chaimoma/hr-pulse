# HR-PULSE: AI-Integrated Job & Salary Pipeline

HR-PULSE is a modern, full-stack application designed to streamline job data management and compensation estimation. It integrates a robust data pipeline using Azure AI, machine learning for salary prediction, and a professional dark-themed web interface.

## 🚀 Features

- **Infrastructure as Code**: Cloud resources managed via Terraform.
- **AI-Powered Data Extraction**: Azure AI (Text Analytics) for Named Entity Recognition (NER) to extract skills from job descriptions.
- **ML Salary Prediction**: A Random Forest regressor trained to provide compensation estimates based on job features and market data.
- **FastAPI Backend**: A high-performance Python API with JWT authentication and professional middleware.
- **Next.js Frontend**: A responsive, premium "Dark and Blue" minimalist dashboard built with Tailwind CSS.
- **Containerization**: Fully orchestrated using Docker Compose for seamless local development.
- **Observability**: Distributed tracing implemented with OpenTelemetry and Jaeger.
- **CI/CD**: Automated linting (Ruff) and testing (Pytest) via GitHub Actions.

## 📁 Project Structure

```text
hr-pulse/
├── backend/            # FastAPI Application (Logic, Auth, DB, Tracing)
│   ├── app/            # Source code
│   ├── tests/          # Pytest suite
│   └── requirements.txt # Python dependencies
├── frontend/           # Next.js Web Application
│   ├── app/            # Pages and Layouts (Dark Theme)
│   └── components/      # Reusable UI components
├── ml/                 # Machine Learning pipeline
│   ├── models/         # Trained salary prediction models
│   └── predict_salary.py # Model training and evaluation logic
├── infrastructure/     # Terraform configuration for Azure
└── docker-compose.yml  # Orchestration for all services
```

## 🛠️ Installation & Setup

### Prerequisites
- Docker & Docker Compose
- Terraform (Optional, for infra)
- Python 3.11 (Optional, for local testing)

### 1. Terraform Infrastructure (Optional)
To setup the required Azure resources:
```bash
cd infrastructure
terraform init
terraform apply
```

### 2. Environment Variables
Create a `.env` file in `backend/app/` based on the following template (secrets are not included in the repository):
```env
DB_URL="your_azure_sql_connection_string"
SECRET_KEY="your_jwt_secret"
api_key="your_azure_ai_key"
endpoint="your_azure_ai_endpoint"
```
*Note: The application includes smart fallbacks for local development if these variables are missing.*

### 3. Docker Compose
Launch the entire stack (Backend, Frontend, and Jaeger):
```bash
docker compose up --build
```

## 🧪 Testing & Linting

### Running Tests
To verify the backend logic (uses a mock-authenticated client for CI compatibility):
```bash
python -m pytest backend/tests/test_predict.py
```

### Linting
To check for code quality and potential issues:
```bash
ruff check .
```

## 📊 Usage

- **Frontend**: Access the dashboard at [http://localhost:3001](http://localhost:3001) (Login with `admin`/`admin` for instant access).
- **Backend API**: Explore the API at [http://localhost:8000/docs](http://localhost:8000/docs).
- **Observability**: View distributed traces in Jaeger at [http://localhost:16686](http://localhost:16686) (Service: `hr-pulse-backend`).


## 👤 Contact
**Author**: Chaima zbairi
**Project**: HR-PULSE Data & AI Pipeline

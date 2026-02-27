FROM python:3.11-slim

WORKDIR /app

# system dependencies for ODBC and building packages
RUN apt-get update && \
    apt-get install -y curl gnupg2 apt-transport-https build-essential && \
    rm -rf /var/lib/apt/lists/*

# microsoft ODBC driver without apt-key
RUN curl https://packages.microsoft.com/config/debian/11/prod.list -o /etc/apt/sources.list.d/mssql-release.list && \
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc-dev && \
    rm -rf /var/lib/apt/lists/*

# copy backend requirements.txt
COPY backend/requirements.txt .
# install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy source code
COPY backend/ ./backend/
COPY ml/ ./ml/

# expose backend port
EXPOSE 8000

# run FastAPI with Uvicorn via python module to ensure it's in PATH
CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
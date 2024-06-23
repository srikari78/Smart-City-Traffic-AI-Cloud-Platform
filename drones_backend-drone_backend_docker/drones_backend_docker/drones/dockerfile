FROM python:3.11.5

# Define environment variable
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN pip install --upgrade pip

WORKDIR /app
# Install system dependencies required by mysqlclient
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    libgl1-mesa-glx \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt .

RUN pip install -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

COPY . .

ENTRYPOINT [ "sh","entrypoint.sh" ]
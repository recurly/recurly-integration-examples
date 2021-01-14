FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 9001

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /usr/src/app
COPY ["./api/dotnet/dotnet.csproj", "./api/dotnet/"]
RUN dotnet restore "./api/dotnet/dotnet.csproj"
COPY ./api/dotnet ./api/dotnet
CMD dotnet run --project "./api/dotnet"

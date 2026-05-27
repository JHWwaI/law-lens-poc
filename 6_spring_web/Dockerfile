# Multi-stage Spring Boot build
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /workspace
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B -DskipTests package


FROM eclipse-temurin:17-jre

WORKDIR /app

RUN groupadd -r lawlens && useradd -r -g lawlens lawlens

COPY --from=build /workspace/target/*.jar app.jar
RUN chown -R lawlens:lawlens /app

USER lawlens

EXPOSE 8080

# Graceful shutdown — wait for in-flight requests
ENV SERVER_SHUTDOWN=graceful \
    SPRING_LIFECYCLE_TIMEOUT_PER_SHUTDOWN_PHASE=30s \
    SPRING_PROFILES_ACTIVE=prod

HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health/liveness || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

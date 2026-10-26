# Stage 1: Build the application using Maven and JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/hirevia/pom.xml .
COPY backend/hirevia/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application using lightweight JRE 21 Alpine
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/hirevia-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8081
EXPOSE 8081

ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]

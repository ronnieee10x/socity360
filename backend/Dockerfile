# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for enterprise container security
RUN addgroup -S society360 && adduser -S society360 -G society360
USER society360:society360

COPY target/society360-backend-1.0.0-SNAPSHOT.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod
ENV DB_URL=jdbc:postgresql://postgres:5432/society360_db
ENV DB_USERNAME=society360_user
ENV DB_PASSWORD=society360_password

ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.6.3

WORKDIR /usr/src/app

COPY ./api/java .

COPY ./public ./src/main/resources/public

RUN mvn clean compile

EXPOSE 9001

CMD mvn exec:java -Dexec.mainClass="com.recurly.examples.App"

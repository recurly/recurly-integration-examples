FROM maven:3

WORKDIR /usr/src/app

COPY ./api/java ./java

# src/main/resources is the expected directory for serving static files
# For more info, see http://sparkjava.com/documentation#static-files
COPY ./public ./src/main/resources/public

RUN cd java && mvn clean compile

EXPOSE 9001

CMD cd java && mvn exec:java -Dexec.mainClass="com.recurly.examples.App"

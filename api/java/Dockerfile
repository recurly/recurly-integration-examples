FROM maven:3

WORKDIR /usr/src/app

COPY ./api/java ./java

# src/main/resources is the expected directory for serving static files
# For more info, see http://sparkjava.com/documentation#static-files
COPY ./public ./src/main/resources/public

EXPOSE 9001

CMD cd java && mvn clean compile && mvn exec:java -Dexec.mainClass="com.recurly.examples.App"

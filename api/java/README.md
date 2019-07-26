## API example: Java + Spark

This small application demonstrates how you might set up a web server
using Java and [Spark][spark] with RESTful routes to accept your Recurly.js
form submissions and use the tokens to create and update customer billing
information without having to handle credit card data.

This example makes use of the un-official Recurly [Java client library][client]
for API v2.

Note that it is not necessary to use the Spark framework. In this example it is
used to organize various API actions into distinct application routes, but one
could just as easily implement these API actions in separate Java classes or
within another application framework altogether.

### Routes

- `POST` [/api/subscriptions/new](src/main/java/com/recurly/App.java#L33-L92)
- `POST` [/api/accounts/new](src/main/java/com/recurly/App.java#L95-L110)
- `PUT` [/api/accounts/:account_code](src/main/java/com/recurly/App.java#L113-L126)

### Use

1. Install dependencies

The Recurly Java library is distributed via [Maven Central](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.ning.billing%22%20AND%20a%3A%22recurly-java-library%22):

```xml
<dependency>
    <groupId>com.ning.billing</groupId>
    <artifactId>recurly-java-library</artifactId>
    <version>0.29.0</version>
</dependency>
```

The Spark Web Framework is distributed via [Maven Central](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.sparkjava%22%20a%3A%22spark-core%22)

```xml
<dependency>
    <groupId>com.sparkjava</groupId>
    <artifactId>spark-core</artifactId>
    <version>2.9.1</version>
</dependency>
```

2.	Start the server

```bash
$ mvn clean compile && mvn exec:java -Dexec.mainClass="com.recurly.examples.App"
```

3. Open [http://localhost:9001](http://localhost:9001)


[spark]: http://sparkjava.com/
[client]: https://github.com/killbilling/recurly-java-library

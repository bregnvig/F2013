#F2013


The HTML5 client to the F1 online betting

### Setting up with tomcat

If your tomcat and the server serving the HTML5 client is not on the same domain (or port) you need to add this to the Tomcat confguration:

```xml
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
</filter>
<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```


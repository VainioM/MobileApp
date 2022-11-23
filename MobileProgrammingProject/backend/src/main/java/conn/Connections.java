package conn;

import java.sql.Connection;


import javax.sql.DataSource;

import com.google.appengine.api.utils.SystemProperty;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/***
 * 
 * Connections helper to get dev or prod connection to database
 *
 */
public class Connections {
	
	/***
	 * Pool of database connections
	 */
	private static DataSource pool=null;
	
	/***
	 * Get database connection.\n
	 * Gets either production pool or local database connection if\n
	 * production environment variable is set
	 * 
	 * @return
	 */
	public static Connection getConnection() {
		Connection conn=null;
	    if (SystemProperty.environment.value() ==SystemProperty.Environment.Value.Production) {  
	    	try {
				conn=Connections.getProductionConnection();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    }
	    else {    
			try {
				conn=Connections.getDevConnection();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    }
	    return conn;
	}
	
	/***
	 * gets production database connection
	 * 
	 * @return conn Connection
	 * @throws Exception
	 */
	public static Connection getProductionConnection() throws Exception{
		if (pool!=null) {
			return pool.getConnection();
		}
		// The configuration object specifies behaviors for the connection pool.
		HikariConfig config = new HikariConfig();
		 // Configure which instance and what database user to connect with.
		config.setJdbcUrl(String.format("jdbc:mysql:///%s", System.getProperty("databasename"))); //e.g. hellogoogle1
		config.setUsername(System.getProperty("googleusername")); // e.g. "root", "postgres"
		config.setPassword(System.getProperty("googlepassword")); // e.g. "my-password"
		
		  // For Java users, the Cloud SQL JDBC Socket Factory can provide authenticated connections.
		  // See https://github.com/GoogleCloudPlatform/cloud-sql-jdbc-socket-factory for details.
		config.addDataSourceProperty("socketFactory", System.getProperty("socketfactory"));
		config.addDataSourceProperty("cloudSqlInstance", System.getProperty("cloudsqlinstance"));
		config.addDataSourceProperty("useSSL", System.getProperty("usessl"));
		
		  // ... Specify additional connection properties here.
		  // ...
		  // Initialize the connection pool using the configuration object.
		pool = new HikariDataSource(config);
		  
		Connection conn=null;
		conn = pool.getConnection();
		return conn;
	}
	
	/***
	 * Get development connection to database
	 * 
	 * @return conn Connection
	 * @throws Exception
	 */
	public static Connection getDevConnection() throws Exception{
		if (pool!=null) {
			return pool.getConnection();
		}
		// The configuration object specifies behaviors for the connection pool.
		HikariConfig config = new HikariConfig();
		 // Configure which instance and what database user to connect with.
		config.setDriverClassName(System.getProperty("drivername")); // see appengine-web.xml
		config.setJdbcUrl("jdbc:mysql://localhost:3306/"+System.getProperty("databasename")+"?useSSL=false"); // see appengine-web.xml
		config.setUsername(System.getProperty("localusername")); // see appengine-web.xml
		config.setPassword(System.getProperty("localpassword")); // see appengine-web.xml
		
		  // Initialize the connection pool using the configuration object.
		pool = new HikariDataSource(config);
		  
		Connection conn=null;
		conn = pool.getConnection();
		return conn;
	}
}
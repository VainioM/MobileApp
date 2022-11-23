package services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.mindrot.jbcrypt.BCrypt;

import conn.Connections;
import util.Authentication;

/***
 * Authentication related routes
 */
@Path("/auth")
public class AuthService {
	
	
	/***
	 * Login route for user authentication. Returns the jwt token\n
	 * or error message including what went wrong.
	 * 
	 * @param username String
	 * @param password String
	 * @return string Response jwt token
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/login")
	public Response login(
			@FormParam("username") String username,
			@FormParam("password") String password) {
		
		Response out = Response.serverError().entity("Generic Error").build();

		if(username.isEmpty() || password.isEmpty()) {
			out = Response.serverError().entity("No empty input allowed").build();
			return out;
		}
		
		Connection conn = Connections.getConnection();
		try {
			PreparedStatement stmt=conn.prepareStatement("select * from users where username=?");
			stmt.setString(1, username);
			ResultSet RS=stmt.executeQuery();
			if (RS.next()) {
				Integer dbid = RS.getInt("id");
				String dbuser = RS.getString("username");
				String dbpass = RS.getString("password");
				if(BCrypt.checkpw(password, dbpass)) {
					try {
						String jwt = Authentication.generateJWT(dbuser, dbid);
						out = Response.ok(jwt, MediaType.TEXT_PLAIN).build();
					}catch(Exception e) {
						System.out.println(e);
						out = Response.serverError().entity("Error generating token").build();
					}
				}else {
					out = Response.serverError().entity("Invalid password").build();
				}
			}else {
				out = Response.serverError().entity("Invalid username/password").build();
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch bloc
			e.printStackTrace();
			out = Response.serverError().entity("Error with database").build();
		}
		finally {
			try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return out;
	}
	
	
	/***
	 * Route to register new users. returns error as text, \n
	 * or message to login if registration completed.
	 * 
	 * @param username
	 * @param password
	 * @return
	 */
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/register")
	public Response register(
			@FormParam("username") String username,
			@FormParam("password") String password) {
		
		Response out = Response.serverError().entity("General Error").build();
		
		if(username.isEmpty() || password.isEmpty()) {
			out = Response.serverError().entity("No empty input allowed").build();
			return out;
		}
		
		Connection conn = Connections.getConnection();
		try {
			PreparedStatement stmt=conn.prepareStatement("insert into users(username, password) values (?, ?)");
			stmt.setString(1, username);
			stmt.setString(2, BCrypt.hashpw(password, BCrypt.gensalt()));
			stmt.execute();
			out = Response.ok("Registration succesful, please login").build();
			
		} catch (SQLException e) {
			// TODO Auto-generated catch bloc
			e.printStackTrace();
			out = Response.serverError().entity("Error with database").build();
		}
		finally {
			try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return out;
	}
	
	/***
	 * Route to check if token is still valid.
	 * 
	 * @param jwt String
	 * @return boolean Response
	 */
	@GET
	@Path("/verify")
	public Response verify(@HeaderParam("Authorization") String jwt) {
		boolean verified = Authentication.verifyJWT(jwt);
		return Response.ok(verified).build();
	}
	
}

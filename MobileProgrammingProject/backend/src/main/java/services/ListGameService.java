package services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


import conn.Connections;
import util.Authentication;

@Path("/listgame")
public class ListGameService {
		

	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes("application/x-www-form-urlencoded")
	@Path("/exportlist/export")
	public Response exportList(@FormParam("user") String username, @FormParam("games") String gamelist) {
		
		Response out = Response.serverError().entity("General Error").build();
		System.out.println("Printing gamelist: " + gamelist);
		
		Connection conn = Connections.getConnection();
		
		try {
			PreparedStatement stmt=conn.prepareStatement("insert into gamelists(username, gamelist) values (?, ?)");
			stmt.setString(1, username);
			stmt.setString(2, gamelist);
			stmt.execute();
			out = Response.ok("Games added to the database").build();
			
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
	
}
	

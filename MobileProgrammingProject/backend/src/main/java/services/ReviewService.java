package services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.appengine.repackaged.com.google.gson.JsonArray;
import com.google.appengine.repackaged.com.google.gson.JsonObject;

import conn.Connections;


/***
 * 
 * Reviewservice for game reviews related 
 *
 */
@Path("/reviewservice")
public class ReviewService {
	
	/***
	 * Java HTTP Client
	 */
	Client client = ClientBuilder.newClient();
	
	/***
	 * Returns the reviews users have posted about that game
	 * 
	 * @param id int
	 * @return json Response array of reviews
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{id}/reviews")
	public Response getGameReviews(@PathParam("id") int id) {
		
		Response out = Response.serverError().entity("Generic Error").build();

		//TODO: make sure range is correct
		if(id <= 0 || id > 999999) {
			return Response.serverError().entity("Error with id").build();
		}
		
		JsonArray arr = new JsonArray();
		Connection conn = Connections.getConnection();
		try {
			PreparedStatement stmt=conn.prepareStatement("select r.id, u.username, r.title, r.content, "
					+ "r.rating, unix_timestamp(r.created_at) as unixtime from reviews r join users u on u.id = r.user_id where game_id=?;");
			stmt.setInt(1, id);
			ResultSet RS=stmt.executeQuery();
			while (RS.next()) {
				JsonObject review = new JsonObject();
				review.addProperty("id", RS.getInt("id"));
				review.addProperty("username", RS.getString("username"));
				review.addProperty("title", RS.getString("title"));
				review.addProperty("content", RS.getString("content"));
				review.addProperty("rating", RS.getDouble("rating"));
				review.addProperty("created_at", RS.getString("unixtime"));
				arr.add(review);
			}
			out = Response.ok(arr.toString(), MediaType.APPLICATION_JSON).build();
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

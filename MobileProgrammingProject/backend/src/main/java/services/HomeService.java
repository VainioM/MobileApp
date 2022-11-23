package services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.soap.Text;

import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

import conn.Connections;
import util.Authentication;

@Path("/homeservice")
public class HomeService {
	
	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	
	Client client = ClientBuilder.newClient();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/games/hot")
	public Response getGameDetails() {
		
		String res = null;
		String key = "hotgames";
		
		res = (String) syncCache.get(key);
		if(res == null) {
			// No data in cache, get it from api and put it in cache
			res = client.target("https://api.rawg.io/api/games?key="+System.getProperty("rawg_api_key")+"&dates=2019-10-10,2020-10-10&ordering=-added")
								.request(MediaType.APPLICATION_JSON)
								.get(String.class);
			syncCache.put(key, res);
		} // Got data from cache!
		
		return Response.ok(res, MediaType.APPLICATION_JSON).build();
	}
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/games/new")
	public Response getNewGameDetails() {
		
		String res = null;
		String key = "newgames";
		
		res = (String) syncCache.get(key);
		if(res == null) {
			// No data in cache, get it from api and put it in cache
			res = client.target("https://api.rawg.io/api/games?key="+System.getProperty("rawg_api_key")+"&dates=2021-01-01,2021-10-10&ordering=-added")
								.request(MediaType.APPLICATION_JSON)
								.get(String.class);
			syncCache.put(key, res);
		} // Got data from cache!
		
		return Response.ok(res, MediaType.APPLICATION_JSON).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/games/{id}/random")
	public Response getRandomGameDetails(@PathParam("id") int id) {
		
		//TODO: make sure range is correct
		if(id <= 0 || id > 999999) {
			return Response.serverError().entity("Error with id").build();
		}
		
		String res = null;
		String key = "game/"+id+"/random";
		
		res = (String) syncCache.get(key);
		if(res == null) {
			// No data in cache, get it from api and put it in cache
			res = client.target("https://api.rawg.io/api/games/"+id+"?key="+System.getProperty("rawg_api_key"))
								.request(MediaType.APPLICATION_JSON)
								.get(String.class);
			syncCache.put(key, res);
		} // Got data from cache!
		
		return Response.ok(res, MediaType.APPLICATION_JSON).build();
	}
	
	
	
	//Does not work at the moment. 
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/games/{token}/review")
	public Response setRating(@PathParam("token") String token) {
			
		String res = null;
		String key = "game/review";
		System.out.println(token);
		Connection conn = Connections.getConnection();
		
		try {
			PreparedStatement stmt = conn.prepareStatement(
					"INSERT INTO reviews (id, game_id, user_id, title, content, rating)"
					+ " VALUES(0, 555, 0, Witcher, Text Review, 4.2)");
		}catch(SQLException e) {
			e.printStackTrace();
		}
		
		finally {
			try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return Response.ok(res, MediaType.APPLICATION_JSON).build();
	}
	
	
	// JUST EXAMPLE ON HOW TO VERIFY
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/games/protected")							  // NEEDS HEADERPARAM
	public Response getGameProtected(@HeaderParam("Authorization") String token) {
		
		// IF VERIFYJWT RETURNS FALSE, TOKEN ISNT VALID
		if(!Authentication.verifyJWT(token)) {
			return Response.serverError().entity("Not permitted to access this service").build();
		}
		
		String res = null;
		String key = "game/details";
		
		res = (String) syncCache.get(key);
		if(res == null) {
			// No data in cache, get it from api and put it in cache
			res = client.target("https://api.rawg.io/api/games/?key="+System.getProperty("rawg_api_key"))
								.request(MediaType.APPLICATION_JSON)
								.get(String.class);
			syncCache.put(key, res);
		} // Got data from cache!
		
		return Response.ok(res, MediaType.APPLICATION_JSON).build();
	}

	
}
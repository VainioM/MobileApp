package services;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

import util.Authentication;

/***
 * 
 * Gameservice route for games related api's
 * 
 */
@Path("/gameservice")
public class GameService {
	
	/***
	 * Caching service using memcache from AppEngine
	 */
	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	
	/***
	 * Java HTTP Client
	 */
	Client client = ClientBuilder.newClient();
	
	/***
	 * Returns the specified games details, either from external api\n
	 * or from the cache if it has been called within 1 hour already
	 * 
	 * @param id int
	 * @return json Response
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/game/{id}/details")
	public Response getGameDetails(@PathParam("id") int id) {
		
		//TODO: make sure range is correct
		if(id <= 0 || id > 999999) {
			return Response.serverError().entity("Error with id").build();
		}
		
		String res = null;
		String key = "game/"+id+"/details";
		
		res = (String) syncCache.get(key);
		if(res == null) {
			// No data in cache, get it from api and put it in cache
			res = client.target("https://api.rawg.io/api/games/"+id+"?key="+System.getProperty("rawg_api_key"))
								.request(MediaType.APPLICATION_JSON)
								.get(String.class);
			syncCache.put(key, res, Expiration.byDeltaSeconds(3600)); // Cache data for 1 hour
		} // Got data from cache!
		
		return Response.ok(res, MediaType.APPLICATION_JSON).build();
	}
	

	// Get games by name from API
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/game/{query}/find")
	public Response getGameByKeyword(@PathParam("query") String query) {
		
	
		
		String res = null;
		
		if(res == null) {
			// No data in cache, get it from api and put it in cache
			res = client.target("https://api.rawg.io/api/games?search_precise=true&search=" + query + "&page_size=20" + "&key="+System.getProperty("rawg_api_key"))
								.request(MediaType.APPLICATION_JSON)
								.get(String.class);
		}
		
		return Response.ok(res, MediaType.APPLICATION_JSON).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/game/popular")
	public Response getPopularGames() {
		
	
		
		String res = null;
		
		if(res == null) {
			// No data in cache, get it from api and put it in cache
			res = client.target("https://api.rawg.io/api/games?page_size=10" + "&key=" +System.getProperty("rawg_api_key"))
								.request(MediaType.APPLICATION_JSON)
								.get(String.class);
		}
		
		return Response.ok(res, MediaType.APPLICATION_JSON).build();
	}
	
}
package util;

import org.jose4j.jwk.RsaJsonWebKey;
import org.jose4j.jwk.RsaJwkGenerator;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.lang.JoseException;

/***
 * Authentication util methods
 */
public class Authentication {
	
	/***
	 * Rsa key used to generate jwt tokens
	 */
	static RsaJsonWebKey rsaJsonWebKey;
	
	/***
	 * Generates new rsa jwk, or returns the cached one if one has already been generates
	 * 
	 * @return rsa jwk
	 */
	public static RsaJsonWebKey getCachedRSAKey() {
		if(rsaJsonWebKey == null) {
			try {
				rsaJsonWebKey = RsaJwkGenerator.generateJwk(2048);
				//System.out.println(rsaJsonWebKey.getPublicKey());
				//System.out.println(rsaJsonWebKey.getPrivateKey());
				//System.out.println(getHexString(rsaJsonWebKey.getPublicKey().getEncoded()));
			} catch (JoseException e) {
				e.printStackTrace();
			}
		}
		
		return rsaJsonWebKey;
	}
	
	/***
	 * Generates a jwt token using cached rsa key and insert the users id and username as claims
	 * 
	 * @param username String
	 * @param id Integer
	 * @return token String
	 * @throws JoseException
	 */
	public static String generateJWT(String username, Integer id) throws JoseException {
		
		RsaJsonWebKey rsakey = getCachedRSAKey();
		
		JwtClaims claims = new JwtClaims();
		// Data
		claims.setSubject(username);
		claims.setClaim("id", id);
		// Security
		//claims.setIssuedAtToNow();
		//claims.setNotBeforeMinutesInThePast(2);
		//claims.setGeneratedJwtId();
		
		JsonWebSignature jws = new JsonWebSignature();
		jws.setKey(rsakey.getPrivateKey());
		jws.setPayload(claims.toJson());
		jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);
		
		return jws.getCompactSerialization();
	}
	
	/***
	 * Verify the given jwt token against the cached rsa token
	 * 
	 * @param jwt String
	 * @return boolean if token is valid
	 */
	public static boolean verifyJWT(String jwt) {
		RsaJsonWebKey rsakey = getCachedRSAKey();
		
		JwtConsumer jwtconsumer = new JwtConsumerBuilder()
									.setRequireSubject()
									.setVerificationKey(rsakey.getKey())
									.build();
		
		try {
			jwtconsumer.processToClaims(jwt.split(" ")[1]);
			//System.out.println(jwtClaims.getSubject().toString());
			return true;
		}catch(InvalidJwtException e) {
			//e.printStackTrace();
			if(e.hasExpired()) {
				return false;
			}
			return false;
		}
	}
	
	
	/***
	 * Get username from the token
	 * 
	 * @param jwt String
	 * @return username String
	 */
	public static String getUsernameFromToken(String jwt) {
		RsaJsonWebKey rsakey = getCachedRSAKey();
		
		JwtConsumer jwtconsumer = new JwtConsumerBuilder()
									.setRequireSubject()
									.setVerificationKey(rsakey.getKey())
									.build();
		
		try {
			JwtClaims jwtClaims = jwtconsumer.processToClaims(jwt.split(" ")[1]);
			return jwtClaims.getSubject().toString();
		}catch(InvalidJwtException e) {
			//e.printStackTrace();
			if(e.hasExpired()) {
				return "";
			}
			return "";
		}catch(MalformedClaimException e) {
			//e.printStackTrace();
			return "";
		}
	}
	
	/***
	 * Gets the id from the token
	 * 
	 * @param jwt String
	 * @return id int
	 */
	public static Integer getIdFromToken(String jwt) {
		RsaJsonWebKey rsakey = getCachedRSAKey();
		
		JwtConsumer jwtconsumer = new JwtConsumerBuilder()
									.setRequireSubject()
									.setVerificationKey(rsakey.getKey())
									.build();
		
		try {
			JwtClaims jwtClaims = jwtconsumer.processToClaims(jwt.split(" ")[1]);
			return (Integer)jwtClaims.getClaimValue("id");
		}catch(InvalidJwtException e) {
			//e.printStackTrace();
			if(e.hasExpired()) {
				return 0;
			}
			return 0;
		}
	}
	
	/* 
	private static String getHexString(byte[] b) {
		String result = "";
		for (int i = 0; i < b.length; i++) {
			result += Integer.toString((b[i] & 0xff) + 0x100, 16).substring(1);
		}
		return result;
	}*/
}

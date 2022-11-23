package app;

import java.io.IOException;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.utils.SystemProperty;

import conn.Connections;

@WebServlet(
    name = "HelloAppEngine",
    urlPatterns = {"/hello"}
)
public class HelloAppEngine extends HttpServlet {

  public void doPost(HttpServletRequest request, HttpServletResponse response) 
	      throws IOException {
	  doGet(request, response);
  }
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) 
      throws IOException {
	    response.setContentType("text/html");
	    response.setCharacterEncoding("UTF-8");
	    PrintWriter out=response.getWriter();
	    out.println("Hello World!");
  }
}
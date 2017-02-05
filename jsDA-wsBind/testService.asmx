<%@ WebService Language="C#" Class="testService" %>

using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;

[WebService(Namespace = "http://software.jonandnic.com/jsObjects", Description="jsDA-wsBind Test Webservice")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class testService  : System.Web.Services.WebService {

    [WebMethod]
    public string Greeting(string YourName) {
        return "Hello " + YourName + "! How are you?";
    }

    [WebMethod]
    public string GetServerTime()
    {
        return "The current time is: " + System.DateTime.Now.ToString();
    }
    
}


/* Import Spark and Recurly client library */
import static spark.Spark.*;

import com.ning.billing.recurly.RecurlyClient;
import com.ning.billing.recurly.model.Account;
import com.ning.billing.recurly.model.BillingInfo;
import com.ning.billing.recurly.model.Subscription;

/* We'll use UUID to generate unique account codes */
import java.util.UUID;

public class App {
  @SuppressWarnings("deprecation")
  public static void main(String[] args) {
    /* Configure the Recurly client with your API key */
    RecurlyClient recurlyClient = new RecurlyClient("APIKEY");
    setPort(9001);
    externalStaticFileLocation("../../public");
    /* POST route to handle a new subscription form */
    post("/api/subscriptions/new", (req, res) -> {
      /* Create the subscription using minimal
        information: plan_code, account_code, currency and
        the token we generated on the front-end */
      Subscription subscriptionData = new Subscription();
      subscriptionData.setPlanCode("basic");
      subscriptionData.setCurrency("USD");
		
      Account accountData = new Account();
      accountData.setAccountCode(UUID.randomUUID().toString());
	
      BillingInfo billingInfoData = new BillingInfo();
      billingInfoData.setTokenId(req.queryParams("recurly-token"));
	
      accountData.setBillingInfo(billingInfoData);
	
      subscriptionData.setAccount(accountData);
	
      recurlyClient.open();
      recurlyClient.createSubscription(subscriptionData);
      recurlyClient.close();
      /*The subscription has been created and we can redirect
        to a confirmation page */
      res.redirect("/SUCCESS_URL");
      return res;
    });
        
    /* POST route to handle a new account form */
    post("/api/accounts/new", (req, res) -> {
      Account accountData = new Account();
      accountData.setAccountCode(UUID.randomUUID().toString());
		
      BillingInfo billingInfoData = new BillingInfo();
      billingInfoData.setTokenId(req.queryParams("recurly-token"));
		
      accountData.setBillingInfo(billingInfoData);
		
      recurlyClient.open();
      recurlyClient.createAccount(accountData);
      recurlyClient.close();
  		
      res.redirect("/SUCCESS_URL");
      return res;
    });
        
    /* PUT route to handle an account update form */
    put("/api/accounts/:account_code", (req, res) -> {
      BillingInfo billingInfoData = new BillingInfo();
      billingInfoData.setTokenId(req.queryParams("recurly-token"));

      Account accountData = new Account();
      accountData.setBillingInfo(billingInfoData);

      recurlyClient.open();
      recurlyClient.updateAccount(req.params(":account_code"), accountData);
      recurlyClient.close();
		
      res.redirect("/SUCCESS_URL");
      return res;
    });
  }
}
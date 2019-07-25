/* Import Spark and Recurly client library */
package com.recurly.examples;

import static spark.Spark.*;

import com.ning.billing.recurly.RecurlyClient;
import com.ning.billing.recurly.model.Account;
import com.ning.billing.recurly.model.BillingInfo;
import com.ning.billing.recurly.model.Subscription;
import com.ning.billing.recurly.TransactionErrorException;
import com.ning.billing.recurly.RecurlyAPIException;
import com.ning.billing.recurly.model.RecurlyErrors;
import com.ning.billing.recurly.model.TransactionError;

/* We'll use UUID to generate unique account codes */
import java.util.UUID;

public class App {
  @SuppressWarnings("deprecation")
  public static void main(String[] args) {
    /* Configure the Recurly client with your API key */
    String apiKey = System.getenv("RECURLY_API_KEY");
    String subdomain = System.getenv("RECURLY_SUBDOMAIN");
    String publicKey = System.getenv("RECURLY_PUBLIC_KEY");
    String successUrl = System.getenv("SUCCESS_URL");
    String errorUrl = System.getenv("ERROR_URL");

    RecurlyClient recurlyClient = new RecurlyClient(apiKey, subdomain);
    setPort(9001);
    externalStaticFileLocation("../../public");

    get("/config.js", (req, res) -> {
      res.type("application/javascript");
      res.body("window.recurlyConfig = { publicKey: '"+ publicKey + "' }");
      return res.body();
    });


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
  
      /* Set the 3D Secure Action Result Token returned from Recurly.js */
      String threeDSART = req.queryParamOrDefault("three-d-secure-token", "");
      if(threeDSART != "") {
        billingInfoData.setThreeDSecureActionResultTokenId(threeDSART);
      }
      accountData.setBillingInfo(billingInfoData);
	
      subscriptionData.setAccount(accountData);
	
      recurlyClient.open();

      try {
        recurlyClient.createSubscription(subscriptionData);
        res.body("{ success: true }");
      } catch(TransactionErrorException e) {
        RecurlyErrors recurlyErrors = e.getErrors().getRecurlyErrors();
        TransactionError transError = e.getErrors().getTransactionError();
        String message = "An unknown error occurred";

        if (transError != null) {
          message = transError.getCustomerMessage();
          String actionTokenId = transError.getThreeDSecureActionTokenId();
          System.out.println("Got me an actionTokenId!!!");
          System.out.println(actionTokenId);
          res.body("{ error: { code: '3ds-required', message: "+ message +", action_token_id: " +actionTokenId +"}}");
        } else if (recurlyErrors != null) {
          message = recurlyErrors.toString();
          res.body("{ error: { message: '" + message + "'}}");
        }
        else {
          e.printStackTrace();
          res.body("{ error: { message: '" + message + "'}}");
        }
      } catch(RecurlyAPIException e) {
        e.printStackTrace();
        String message = e.getRecurlyError().getSymbol() + ": " + e.getRecurlyError().getDescription();
        System.out.println(message);
        res.body("{ error: { message: '" + message + "'}}");
      }

      recurlyClient.close();
      /*The subscription has been created and we can redirect
        to a confirmation page */
      
      res.redirect(successUrl);
      return res.body();
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
  		
      res.redirect(successUrl);
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
		
      res.redirect(successUrl);
      return res;
    });

    /* POST route for 3D Secure example */
    // post("/api/subscriptions/new-3ds", (req, res) -> {
    //   Subscription subscriptionData = new Subscription();
    //   subscriptionData.setPlanCode("basic");
    //   subscriptionData.setCurrency("USD");
		
    //   Account accountData = new Account();
    //   accountData.setAccountCode(UUID.randomUUID().toString());
	
    //   BillingInfo billingInfoData = new BillingInfo();
    //   billingInfoData.setTokenId(req.queryParams("recurly-token"));

    //   /* Set the 3D Secure Action Result Token returned from Recurly.js */
    //   String threeDSART = req.queryParams("three-d-secure-token");
    //   if(threeDSART != null) {
    //     billingInfoData.setThreeDSecureActionResultTokenId(threeDSART);
    //   }
	
    //   accountData.setBillingInfo(billingInfoData);
	
    //   subscriptionData.setAccount(accountData);
	
    //   recurlyClient.open();

    //   try {
    //     recurlyClient.createSubscription(subscriptionData);
    //     res.body("{ success: true }");
    //   } catch(TransactionErrorException e) {
    //     RecurlyErrors recurlyErrors = e.getErrors().getRecurlyErrors();
    //     TransactionError transError = e.getErrors().getTransactionError();
    //     String message = "An unknown error occurred";

    //     if (transError != null) {
    //       message = transError.getCustomerMessage();
    //       String actionTokenId = transError.getThreeDSecureActionTokenId();
    //       System.out.println("Got me an actionTokenId!!!");
    //       System.out.println(actionTokenId);
    //       res.body("{ error: { code: '3ds-required', message: "+ message +", action_token_id: " +actionTokenId +"}}");
    //     } else if (recurlyErrors != null) {
    //       message = recurlyErrors.toString();
    //       res.body("{ error: { message: '" + message + "'}}");
    //     }
    //     else {
    //       e.printStackTrace();
    //       res.body("{ error: { message: '" + message + "'}}");
    //     }
    //   } catch(Exception e) {
    //     System.out.println("We shouldn't be here but we are");
    //   }
    //   recurlyClient.close();

    //   res.type("application/json");
    //   return res.body();
    // });
  }
}

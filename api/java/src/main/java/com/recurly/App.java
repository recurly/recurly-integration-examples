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
    String publicDir = System.getenv("PUBLIC_DIR_PATH");

    RecurlyClient recurlyClient = new RecurlyClient(apiKey, subdomain);
    setPort(9001);
    if (publicDir != null) {
      staticFiles.externalLocation(publicDir);
    } else {
      externalStaticFileLocation("../../public");
    }

    /* POST route to handle a new subscription form */
    post("/api/subscriptions/new", (req, res) -> {
      /* Create the subscription using minimal
        information: plan_code, account_code, currency and
        the token we generated on the front-end */
      String tokenId = req.queryParams("recurly-token");

      Subscription subscriptionData = new Subscription();
      subscriptionData.setPlanCode("basic");
      subscriptionData.setCurrency("USD");

      Account accountData = new Account();
      String accountCode = req.queryParams("recurly-account-code");
      if (accountCode == null) {
        accountCode = UUID.randomUUID().toString();
      }
      accountData.setAccountCode(accountCode);

      BillingInfo billingInfoData = new BillingInfo();
      billingInfoData.setTokenId(tokenId);

      /* If it exists, set the 3D Secure Action Result Token returned from Recurly.js */
      String threeDSART = req.queryParams("three-d-secure-token");
      if (threeDSART != null && !threeDSART.isEmpty()) {
        billingInfoData.setThreeDSecureActionResultTokenId(threeDSART);
      }
      accountData.setBillingInfo(billingInfoData);

      subscriptionData.setAccount(accountData);

      recurlyClient.open();

      try {
        recurlyClient.createSubscription(subscriptionData);

        /*The subscription has been created and we can redirect
          to a confirmation page */
        res.redirect(successUrl);
      } catch(TransactionErrorException e) {
        /**
         * Note: This is not an example of extensive error handling,
         * it is scoped to handling the 3DSecure error for simplicity.
         * Please ensure you have proper error handling before going to production.
         */
        TransactionError transactionError = e.getErrors().getTransactionError();

        if (transactionError != null) {
          String actionTokenId = transactionError.getThreeDSecureActionTokenId();
          res.redirect("/3d-secure/authenticate.html#token_id=" + tokenId + "&action_token_id=" + actionTokenId + "&account_code=" + accountCode);
        }
      }

      recurlyClient.close();
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


    /* This endpoint provides configuration to recurly.js */
    get("/config", (req, res) -> {
      res.type("application/javascript");
      res.body("window.recurlyConfig = { publicKey: '"+ publicKey + "' }");
      return res.body();
    });
  }
}

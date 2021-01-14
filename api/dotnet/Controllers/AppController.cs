using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Recurly;
using Recurly.Resources;

namespace dotnet.Controllers
{
    [ApiController]
    public class AppController : ControllerBase
    {
        private readonly Client _client;

        private readonly ILogger<AppController> _logger;

        public AppController(ILogger<AppController> logger)
        {
            _client = new Client(APIKey);
            _logger = logger;
        }

        // TODO: Bring over advanced item purchasing from ruby example
        [HttpPost("api/subscriptions/new")]
        public RedirectResult CreatePurchase([FromForm(Name = "recurly-token")] string tokenId, [FromForm(Name = "account-code")] string accountCode, [FromForm(Name = "first-name")] string firstName, [FromForm(Name = "last-name")] string lastName)
        {
            // If our form specifies an account code, we can use that; otherwise,
            // create an account code with a uniq id
            accountCode = accountCode ?? Guid.NewGuid().ToString();

            var purchaseReq = new PurchaseCreate()
            {
                Currency = "USD",
                Account = new AccountPurchase()
                {
                    Code = accountCode,
                    FirstName = firstName,
                    LastName = lastName,
                    BillingInfo = new BillingInfoCreate()
                    {
                        TokenId = tokenId
                    }
                },
                Subscriptions = new List<SubscriptionPurchase>()
                {
                    new SubscriptionPurchase() { PlanCode = "basic" }
                }
            };

            try
            {
                InvoiceCollection collection = _client.CreatePurchase(purchaseReq);
                _logger.LogInformation($"Created ChargeInvoice with Number: {collection.ChargeInvoice.Number}");
            }
            catch (Recurly.Errors.Transaction e)
            {   
                /**
                * Note: This is not an example of extensive error handling,
                * it is scoped to handling the 3DSecure error for simplicity.
                * Please ensure you have proper error handling before going to production.
                */
                TransactionError transactionError = e.Error.TransactionError;

                if (transactionError != null && transactionError.Code == "three_d_secure_action_required") {
                  string actionTokenId = transactionError.ThreeDSecureActionTokenId;
                  return Redirect($"/3d-secure/authenticate.html#token_id={tokenId}&action_token_id={actionTokenId}&account_code={accountCode}");
                }

                return HandleError(e);
            }
            catch (Recurly.Errors.ApiError e)
            {   
              return HandleError(e);
            }

            return Redirect(SuccessURL);
        }

        [HttpPost("api/accounts/new")]
        public ActionResult CreateAccount([FromForm(Name = "account-code")] string accountCode, [FromForm(Name = "first-name")] string firstName, [FromForm(Name = "last-name")] string lastName)
        {
            // If our form specifies an account code, we can use that; otherwise,
            // create an account code with a uniq id
            accountCode = accountCode ?? Guid.NewGuid().ToString();

            var accountReq = new AccountCreate()
            {
                Code = accountCode,
                FirstName = firstName,
                LastName = lastName
            };

            try
            {
                Account account = _client.CreateAccount(accountReq);
                _logger.LogInformation($"Created account {account.Code}");
            }
            catch (Recurly.Errors.ApiError e)
            {
                return HandleError(e);
            }

            return Redirect(SuccessURL);
        }

        [HttpPut("api/accounts/{accountId}")]
        public ActionResult UpdateAccount(string accountId, [FromForm(Name = "first-name")] string firstName, [FromForm(Name = "last-name")] string lastName)
        {
            var accountReq = new AccountUpdate() {
                FirstName = firstName,
                LastName = lastName
            };

            try
            {
                Account account = _client.UpdateAccount(accountId, accountReq);
                _logger.LogInformation($"Updated account {account.Code}");
            }
            catch (Recurly.Errors.ApiError e)
            {
                return HandleError(e);
            }

            return Redirect(SuccessURL);
        }

        /* This endpoint provides configuration to recurly.js */
        [HttpGet("config")]
        public ContentResult GetGonfig()
        {
            var config = new {
                publicKey = APIPublicKey
            };

            return Content($"window.recurlyConfig = {System.Text.Json.JsonSerializer.Serialize(config)}", "application/javascript");
        }

        private RedirectResult HandleError(Exception e)
        {
            _logger.LogError(e, "Exception caught: redirecting");
            return Redirect($"{ErrorURL}?error={e.Message}");
        }
        
        private string APIKey
        {
            get { return Environment.GetEnvironmentVariable("RECURLY_API_KEY"); }
        }

        private string APIPublicKey
        {
            get { return Environment.GetEnvironmentVariable("RECURLY_PUBLIC_KEY"); }
        }

        private string SuccessURL
        {
            get { 
              string url = Environment.GetEnvironmentVariable("SUCCESS_URL");
              return String.IsNullOrEmpty(url) ? "/" : url;
            }
        }

        private string ErrorURL
        {
            get {
              string url = Environment.GetEnvironmentVariable("ERROR_URL");
              return String.IsNullOrEmpty(url) ? "/" : url;
            }
        }
    }
}

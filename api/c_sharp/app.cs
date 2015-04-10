//Import Nancy and the Recurly client library
using System;
using Recurly;
using Nancy;
using Nancy.Hosting.Self;

namespace App
{
	class MainClass
	{

		public static void Main (string[] args)
		{
			var host = new NancyHost (new Uri ("http://localhost:9001"));
			host.Start();
			Console.WriteLine("Nancy now listening - navigating to http://localhost:9001. Press enter to stop");
			Console.ReadLine();
		}
	}


	public class RecurlyInterface : Nancy.NancyModule{
		public RecurlyInterface()
		{
			// POST route to handle a new subscription form
			Post["/api/subscriptions/new"] = _ =>
			{
				//We'll wrap this in a try to catch any API errors that may occur
				try
				/* Create the scubscription using minimal
				information: plan_code, account_code, currency and
				the token we generated on the frontend */
				{
					String uuid = Guid.NewGuid().ToString();
					Account account = new Account(uuid);

					BillingInfo billingInfo = new BillingInfo(account){
						TokenId = Request.Form["recurly-token"]
					};

					account.BillingInfo = billingInfo;

					Plan plan = Plans.Get("basic");
					Subscription subscription = new Subscription(account, plan, "USD");
					subscription.Create();
				}
				catch (RecurlyException e)
				{
					return e.Errors;
				}

				/* The subscription has been created
				and we can redirect to a confirmation page */
				return Response.AsRedirect("/Content/minimal/index.html");
			};

			//POST route to handle a new account form
			Post ["/api/accounts/new"] = _ => 
			{
				try
				{
					String uuid = Guid.NewGuid ().ToString ();
					Account account = new Account (uuid);

					BillingInfo billingInfo = new BillingInfo (account) {
						TokenId = Request.Form["recurly-token"]
					};

					account.BillingInfo = billingInfo;
					account.Create();
				}
				catch (RecurlyException e)
				{
					return e.Errors;
				}

				return Response.AsRedirect("/Content/minimal/index.html");
			};

			//PUT route to handle an account update form
			Put["/api/accounts/{account_code}"] = parameters =>
			{
				try
				{
					Account account = Accounts.Get(parameters["account_code"]);
					BillingInfo billingInfo = new BillingInfo(account){
						TokenId = Request.Form["recurly-token"]
					};

					billingInfo.Update();
				}
				catch (RecurlyException e)
				{
					return e.Errors;
				}

				return Response.AsRedirect("/Content/minimal/index.html");
			};
		}
	}
}
package main

// API usage Dependencies
import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/google/uuid"
	"github.com/recurly/recurly-client-go/v3"
)

// These are the various configuration values used in this example. They are
// pulled from the ENV for ease of use, but can be defined directly or stored
// elsewhere
var RECURLY_PUBLIC_KEY = os.Getenv("RECURLY_PUBLIC_KEY")
var RECURLY_API_KEY = os.Getenv("RECURLY_API_KEY")
var SUCCESS_URL = os.Getenv("SUCCESS_URL")
var ERROR_URL = os.Getenv("ERROR_URL")

// Instantiate a configured recurly client
var client = recurly.NewClient(RECURLY_API_KEY)

// POST route to handle a new subscription form
func createSubscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method.", 405)
	}

	accountCode := r.FormValue("recurly-account-code")

	// Create an accountCode if one is not sent in the request
	if accountCode == "" {
		accountCode = uuid.New().String()
	}

	tokenId := r.FormValue("recurly-token")
	accountFirstName := r.FormValue("first-name")
	accountLastName := r.FormValue("last-name")
	currency := r.FormValue("currency")
	if currency == "" {
		currency = "USD"
	}

	// Build the billing info body
	billingInfo := &recurly.BillingInfoCreate{
		TokenId: recurly.String(tokenId),
	}

	// Optionally add a 3D Secure token if one is present. You only need to do this
	// if you are integrating with Recurly's 3D Secure support
	threeDSecureToken := r.FormValue("three-d-secure-token")

	// If the request includes a threeDSecureToken, add this to the BillingInfo body
	if threeDSecureToken != "" {
		billingInfo = &recurly.BillingInfoCreate{
			TokenId:                         recurly.String(tokenId),
			ThreeDSecureActionResultTokenId: recurly.String(threeDSecureToken),
		}
	}

	// Create the purchase using minimal information: planCode, currency, account.code, and
	// the token we generated on the frontend
	purchaseCreate := &recurly.PurchaseCreate{
		Subscriptions: []recurly.SubscriptionPurchase{{PlanCode: recurly.String("basic")}},
		Currency:      recurly.String(currency),
		Account: &recurly.AccountPurchase{
			Code:        recurly.String(accountCode),
			FirstName:   recurly.String(accountFirstName),
			LastName:    recurly.String(accountLastName),
			BillingInfo: billingInfo,
		},
	}

	invoiceCollection, err := client.CreatePurchase(purchaseCreate)
	if e, ok := err.(*recurly.Error); ok {
		// Handle 3D Secure required error by redirecting to an authentication page
		if e.TransactionError != nil && e.TransactionError.Code == "three_d_secure_action_required" {
			baseUrl := "/3d-secure/authenticate.html"

			params := fmt.Sprintf(
				"token_id=%s&action_token_id=%s&account_code=%s",
				tokenId,
				e.TransactionError.ThreeDSecureActionTokenId,
				accountCode,
			)

			url := fmt.Sprintf("%s#%s", baseUrl, params)

			http.Redirect(w, r, url, 303)
		} else {
			// If any other error occurs,
			// redirect to an error page with the error as a query param
			errorUrl := fmt.Sprintf("%s?error=%s", ERROR_URL, e.Message)

			http.Redirect(w, r, errorUrl, 303)
		}
	} else {
		if len(invoiceCollection.ChargeInvoice.Transactions) > 0 {

			// TODO: Change to use invoiceCollection.ChargeInvoice.Transactions[0].ActionResult
			actionResult := invoiceCollection.ChargeInvoice.Transactions[0].GatewayResponseValues["action_result"]

			if actionResult != nil {
				type Result struct {
					ActionResult interface{} `json:"action_result"`
				}

				response := Result{ActionResult: actionResult}
				responseStr, err := json.Marshal(response)
				if err != nil {
					errorUrl := fmt.Sprintf("%s?error=%s", ERROR_URL, e.Message)
					http.Redirect(w, r, errorUrl, 303)
				} else {
					w.Header().Add("Content-Type", "application/json")
					fmt.Fprint(w, string(responseStr))
				}
				return
			}
		}
		http.Redirect(w, r, SUCCESS_URL, 303)
	}

}

// POST route to handle a new account form
func createAccount(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method.", 405)
	}

	accountCode := uuid.New().String()

	tokenId := r.FormValue("recurly-token")

	accountCreate := &recurly.AccountCreate{
		Code: recurly.String(accountCode),
		BillingInfo: &recurly.BillingInfoCreate{
			TokenId: recurly.String(tokenId),
		},
	}

	_, err := client.CreateAccount(accountCreate)

	if e, ok := err.(*recurly.Error); ok {
		errorUrl := fmt.Sprintf("%s?error=%s", ERROR_URL, e.Message)

		http.Redirect(w, r, errorUrl, 303)
	} else {
		http.Redirect(w, r, SUCCESS_URL, 303)
	}
}

// PUT route to handle an account update form
func updateAccount(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		http.Error(w, "Invalid request method.", 405)
	}

	tokenId := r.FormValue("recurly-token")

	accountUpdate := &recurly.AccountUpdate{
		BillingInfo: &recurly.BillingInfoCreate{
			TokenId: recurly.String(tokenId),
		},
	}

	accountCode := fmt.Sprintf("%s", strings.Split(r.URL.String(), "/")[3])

	_, err := client.UpdateAccount(accountCode, accountUpdate)

	if e, ok := err.(*recurly.Error); ok {
		errorUrl := fmt.Sprintf("%s?error=%s", ERROR_URL, e.Message)

		http.Redirect(w, r, errorUrl, 303)
	} else {
		http.Redirect(w, r, SUCCESS_URL, 303)
	}
}

func config(w http.ResponseWriter, req *http.Request) {
	req.Header.Add("Content-Type", "application/javascript")

	recurlyConfig := fmt.Sprintf("window.recurlyConfig = { publicKey: '%s', api: 'https://api.%s/js/v1'}",
		RECURLY_PUBLIC_KEY,
		os.Getenv("RECURLY_API_HOST"),
	)
	adyenConfig := fmt.Sprintf("window.adyenConfig = { publicKey: '%s' }", os.Getenv("ADYEN_PUBLIC_KEY"))

	response := fmt.Sprintf("%s;\n%s;", recurlyConfig, adyenConfig)

	fmt.Fprint(w, response)
}

func main() {
	publicDirPath := os.Getenv("PUBLIC_DIR_PATH")

	if publicDirPath == "" {
		publicDirPath = "../../public"
	}

	http.Handle("/", http.FileServer(http.Dir(publicDirPath)))

	http.HandleFunc("/config", config)

	http.HandleFunc("/api/subscriptions/new", createSubscription)

	http.HandleFunc("/api/accounts/new", createAccount)

	http.HandleFunc("/api/accounts/", updateAccount)

	http.ListenAndServe(":9001", nil)
}

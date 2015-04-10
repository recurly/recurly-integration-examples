package main

import (
  "github.com/hoisie/web"
  "github.com/cgerrior/gorecurly"
  "fmt"
  "crypto/rand"
)

//Configure the recurly client with your api key and public key
var r = gorecurly.InitRecurly("API KEY", "PUBLIC KEY")

//"UUID" generator
func pseudo_uuid() (uuid string) {
  b := make([]byte, 16)
  _, err := rand.Read(b)
  if err != nil {
    fmt.Println("Error: ", err)
    return
  }
  uuid = fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
  return
}

// POST route to handle a new subscription form
func new_subscription(ctx *web.Context) {
  //Create the scubscription using minimal information: plan_code, account_code, currency and the token we generated on the frontend
  sub := r.NewSubscription()
  sub.EmbedAccount = new(gorecurly.Account)
  sub.EmbedAccount.AccountCode = pseudo_uuid()
  sub.EmbedAccount.B = new(gorecurly.BillingInfo)
  sub.EmbedAccount.B.TokenID = ctx.Params["recurly-token"]
  sub.PlanCode = "basic"
  sub.Currency = "USD"
  //The subscription has been created and we can redirect to a confirmation page
  if err := sub.Create(); err == nil {
    ctx.Redirect(200,"SUCCESS_URL")
  } else {
    ctx.Redirect(400,"ERROR_URL?errors=" + err.Error())
  }
}

// POST route to handle a new account form
func new_account(ctx *web.Context){
  acc := r.NewAccount()
  acc.AccountCode = pseudo_uuid()
  acc.B = new(gorecurly.BillingInfo)
  acc.B.TokenID = ctx.Params["recurly-token"]
  if err := acc.Create(); err == nil {
    ctx.Redirect(200,"SUCCESS_URL")
  } else {
    ctx.Redirect(400,"ERROR_URL?errors=" + err.Error())
  }
}

//PUT route to handle an account update form
func update_account(ctx *web.Context, account_code string){
  acc, err := r.GetAccount(account_code)
  if err != nil {
    ctx.Redirect(400,"ERROR_URL?errors=" + err.Error())
  } 
  acc.B = new(gorecurly.BillingInfo)
  acc.B.TokenID = ctx.Params["recurly-token"]
  if err := acc.Update(); err == nil {
    ctx.Redirect(200,"SUCCESS_URL")
  } else {
    ctx.Redirect(400,"ERROR_URL?errors=" + err.Error())
  }
}

func main() {
  web.Config.StaticDir = "/../../public"
  web.Post("/api/subscriptions/new", new_subscription)
  web.Post("/api/accounts/new", new_account)
  web.Put("/api/accounts/(.*)", update_account)
  web.Run("0.0.0.0:9001")
}
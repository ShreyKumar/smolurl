package main

import (
    "encoding/json"
    "log"
    "net/http"
    "fmt"

    "github.com/gorilla/mux"
    "github.com/melvinmt/firebase"
)

type Url struct {
  Count int `json:"count"`
  ActualUrl string `json:"actualurl"`
  Visits []Visit `json:"visits"`
}

type Visit struct {
  Browser string `json:"browser"`
  TimeStamp string `json:"timestamp"`
  IP string `json:"ip"`
  City string `json:"city"`
  Region string `json:"region"`
  Region_code string `json:"region_code"`
  Country string `json:"country"`
  Country_name string `json:"country_name"`
  Lat float64 `json:"lat"`
  Long float64 `json:"long"`
  Utc_offset string `json:"utc_offset"`
  Asn string `json:"asn"`
  Org string `json:"org"`
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
  (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
  (*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func GetURL(w http.ResponseWriter, req *http.Request) *Url{
  params := mux.Vars(req)
  authToken := "PrSJdkmDMnCibAQLtVHGD37ronVVMerMJvdRuypr"
  dburl := "https://smollnk-2e7c8.firebaseio.com/" + params["code"]
  ref := firebase.NewReference(dburl).Auth(authToken).Export(false)

  var item *Url = &Url{}

  var err error
  if err = ref.Value(item); err != nil {
    panic(err)
  }

  return item
}

//update count and append to visit
func Redirect(w http.ResponseWriter, req *http.Request) {
  enableCors(&w)

  var url *Url = GetURL(w, req)
  params := mux.Vars(req)

  //get visit
  var visit Visit
  _ = json.NewDecoder(req.Body).Decode(&visit)

  url.Count += 1
  url.Visits = append(url.Visits, visit)

  //update in db
  dburl := "https://smollnk-2e7c8.firebaseio.com/" + params["code"]
  authToken := "PrSJdkmDMnCibAQLtVHGD37ronVVMerMJvdRuypr"
  ref := firebase.NewReference(dburl).Auth(authToken)

  var err error
  if err = ref.Update(url); err != nil {
    panic(err)
  }

  json.NewEncoder(w).Encode(url)

}

func GetURLEndpoint(w http.ResponseWriter, req *http.Request) {
  enableCors(&w)
  json.NewEncoder(w).Encode(GetURL(w, req))
}

func CreateURLEndpoint(w http.ResponseWriter, req *http.Request) {
  enableCors(&w)
  params := mux.Vars(req)
  var url Url
  _ = json.NewDecoder(req.Body).Decode(&url)

  //initialize db
  dburl := "https://smollnk-2e7c8.firebaseio.com/" + params["code"]
  authToken := "PrSJdkmDMnCibAQLtVHGD37ronVVMerMJvdRuypr"
  ref := firebase.NewReference(dburl).Auth(authToken)

  var err error
  if err = ref.Write(url); err != nil {
    panic(err)
  }

  fmt.Fprint(w, "url created")
}

func ControlOptions(w http.ResponseWriter, req *http.Request) {
  enableCors(&w)
  if (*req).Method == "OPTIONS" {
    return
  }
}
func HandleEndpoints(router *mux.Router) {
  router.HandleFunc("/urls/{code}", GetURLEndpoint).Methods("GET")
  router.HandleFunc("/urls/{code}", CreateURLEndpoint).Methods("POST")
  router.HandleFunc("/urls/{code}", ControlOptions).Methods("OPTIONS")
  router.HandleFunc("/rd/{code}", Redirect).Methods("POST")
  router.HandleFunc("/rd/{code}", ControlOptions).Methods("OPTIONS")

}

func main() {
  router := mux.NewRouter()
  HandleEndpoints(router)

  log.Fatal(http.ListenAndServe(":12345", router))
}

package main

import (
  "encoding/json"
  "net/http"
  "net/http/httptest"
  //"fmt"
  "testing"
  "bytes"

  "github.com/gorilla/mux"
  "github.com/stretchr/testify/assert"
)

func TestGetURLEndpoint(t *testing.T) {
  router := mux.NewRouter()
  HandleEndpoints(router)

  request, _ := http.NewRequest("GET", "/urls/00y0y", nil)
  response := httptest.NewRecorder()
  router.ServeHTTP(response, request)
  assert.Equal(t, 200, response.Code, "OK response is expected")
}

func TestCreateURLEndpoint(t *testing.T) {
  router := mux.NewRouter()
  HandleEndpoints(router)

  visit := &Visit{
    Browser: "Chrome",
    TimeStamp: "23 o clock",
    IP: "sample",
    City: "Toronto",
    Region: "Ontario",
    Region_code: "ON",
    Country: "CA",
    Country_name: "Canada",
    Lat: 0,
    Long: 0,
    Utc_offset: "-0400",
    Asn: "sample",
    Org: "Rogers Communications Canada Inc.",
  }

  visits := []Visit{*visit}

  url := &Url{
    Count: 1,
    ActualUrl: "www.google.com",
    Visits: visits,
  }

  jsonUrl, _ := json.Marshal(url)
  request, _ := http.NewRequest("POST", "/urls/11x1x", bytes.NewBuffer(jsonUrl))
  response := httptest.NewRecorder()
  router.ServeHTTP(response, request)
  assert.Equal(t, 200, response.Code, "OK response is expected")
}

func TestRedirect(t *testing.T) {
  router := mux.NewRouter()
  HandleEndpoints(router)

  visit := &Visit{
    Browser: "Chrome",
    TimeStamp: "23 o clock",
    IP: "sample",
    City: "Toronto",
    Region: "Ontario",
    Region_code: "ON",
    Country: "CA",
    Country_name: "Canada",
    Lat: 0,
    Long: 0,
    Utc_offset: "-0400",
    Asn: "sample",
    Org: "Rogers Communications Canada Inc.",
  }

  jsonVisit, _ := json.Marshal(visit)
  request, _ := http.NewRequest("POST", "/urls/11x1x", bytes.NewBuffer(jsonVisit))
  response := httptest.NewRecorder()
  router.ServeHTTP(response, request)
  assert.Equal(t, 200, response.Code, "OK response is expected")
}

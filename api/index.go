package api

import (
	"fmt"
	"net/http"
	"os"

	environment "github.com/codeallthethingz/slow-vercel-dev/api/environment"
	"github.com/go-chi/chi"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/card"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	c := chi.NewRouter()
	c.Group(func(r chi.Router) {
		r.Get("/api/environment", environment.GetEnvironment)
	})

	loadLibs()
	db()
	c.ServeHTTP(w, r)
}

func loadLibs() {
	card.Del("cardID", &stripe.CardParams{Customer: stripe.String("")})
}

var database *gorm.DB = nil

func db() *gorm.DB {
	if database != nil {
		return database
	}
	dsn := os.Getenv("DSN")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	database = db
	return database
}

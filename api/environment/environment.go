package environemnt

import (
	"fmt"
	"net/http"
	"os"
)

var environment string = ""

func GetEnvironment(w http.ResponseWriter, r *http.Request) {
	setEnvironment()
	fmt.Fprintf(w, "%s", environment)
}

func setEnvironment() {
	if environment != "" {
		return
	}
	if os.Getenv("OVERRIDE_PREVIEW") != "" {
		environment = "preview"
		return
	}
	if os.Getenv("VERCEL_ENV") == "" {
		environment = "development"
		return
	}

	environment = os.Getenv("VERCEL_ENV")
}

func IsProduction() bool {
	setEnvironment()
	return environment == "production"
}

func IsDevelopment() bool {
	setEnvironment()
	return environment == "development"
}

func IsPreview() bool {
	setEnvironment()
	return environment == "preview"
}

func GetEnvironmentName() string {
	setEnvironment()
	return environment
}

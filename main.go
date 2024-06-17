package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"golang.org/x/crypto/bcrypt"
)

var store = sessions.NewCookieStore([]byte("your-secret-key"))

type User struct {
	Name        string `json:"name"`
	Phonenumber string `json:"phonenumber"`
	Password    string `json:"password"`
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	http.HandleFunc("/registration", handleRegistrationPage)
	http.HandleFunc("/login", handleLoginPage)

	port := 8080
	fmt.Printf("Server is listening on port %d...\n", port)

	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		fmt.Println("Error starting the server:", err)
	}

	log.Println("Server started on port 8080")
}

func handleRegistrationPage(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	switch r.Method {
	case http.MethodPost:
		name := r.FormValue("name")
		phonenumber := r.FormValue("phonenumber")
		password := r.FormValue("password")

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		user := User{
			Name:        name,
			Phonenumber: phonenumber,
			Password:    string(hashedPassword),
		}

		clientOptions := options.Client().ApplyURI("mongodb+srv://220727:1234567899@cluster0.authau1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
		client, err := mongo.Connect(context.Background(), clientOptions)
		if err != nil {
			log.Fatal(err)
		}
		defer client.Disconnect(context.Background())

		err = client.Ping(context.Background(), readpref.Primary())
		if err != nil {
			log.Fatal(err)
		}

		collection := client.Database("auth").Collection("users")
		_, err = collection.InsertOne(context.Background(), user)
		if err != nil {
			log.Println("Error inserting user into MongoDB:", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, "Registration successful")
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleLoginPage(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	switch r.Method {
	case http.MethodPost:
		phonenumber := r.FormValue("phonenumber")
		password := r.FormValue("password")

		clientOptions := options.Client().ApplyURI("mongodb+srv://220727:1234567899@cluster0.authau1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
		client, err := mongo.Connect(context.Background(), clientOptions)
		if err != nil {
			log.Fatal(err)
		}
		defer client.Disconnect(context.Background())

		err = client.Ping(context.Background(), readpref.Primary())
		if err != nil {
			log.Fatal(err)
		}

		collection := client.Database("auth").Collection("users")
		var user User
		err = collection.FindOne(context.Background(), bson.M{"phonenumber": phonenumber}).Decode(&user)
		if err != nil {
			fmt.Println("Error finding user in MongoDB:", err)
			http.Error(w, "Invalid phone number or password", http.StatusUnauthorized)
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err != nil {
			http.Error(w, "Invalid2 phone number or password", http.StatusUnauthorized)
			return
		}

		session, err := store.Get(r, "session-name")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		session.Values["username"] = user.Name
		session.Save(r, w)

		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Successfully logged in")
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

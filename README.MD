# Contacts API

## Setup

NOTE: If you have Docker installed, instead of installing Java and downloading the DynamoDb-Local jar file to run, you can run `docker-compose up -d` command against the `docker-compose.yml` file in this project to set up DynamoDb running instead of LocalStack with persisted data turned on.

---

Download the DynamoDb-Local jar file for your system [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html).

  - Extract the jar file to the root of this repository (the parent of this project folder) under the name: `dynamodb_local`.

Create a `.env` file at the root of the project and add in your own values for these enviornment variables.

  - `AWS_ENDPOINT='http://localhost:8000/'`
  - `AWS_REGION='localhost'`
  - `AWS_ACCESS_KEY_ID='fake-access-key'`
  - `AWS_SECRET_ACCESS_KEY='fake-secret-key'`

**IMPORTANT: DO NOT COMMIT THE `.env` FILE!!!**

## Running

DynamoDB Local

  - Open a terminal at the the folder where you extracted the jar file (Setup section).
    - Run: `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb` to start it on the default port: `8000`.
    - Open a browser at: `http://localhost:8000/shell` to interact with DynamoDB through the interactive shell.

...Or LocalStack Docker container
  - Run `docker-compose up -d`
  - If you already run the `docker-compose.yml` file and didn't teardown the container, start it again with, `docker-compose start`.

Lambda Functions

  - Run `npm run seed` to seed some test data.
  - Run `npm start` to start the functions locally.

Test by trying to hit an Api endpoint in the Postman.

  - `http://localhost:3000/contacts/`

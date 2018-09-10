# Contacts API

## Setup

Download the DynamoDb-Local jar file for your system [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html).

  - Extract the jar file to the root of this repository (the parent of this project folder) under the name: `dynamodb_local`.

Install the following dev packages using `npm install --save-dev <package-name>`:

  - `aws-sdk` - installing this as a dev dependency because AWS Lambda already includes it.
  - `serverless` - to manage our deployments of the functions.
  - `serverless-offline` - a serverless plugin to run our functions offline.

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

Lambda Functions

  - Run `npm start` to start the functions locally.

Test by trying to hit an Api endpoint in the Postman.
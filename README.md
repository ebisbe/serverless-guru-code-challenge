# Project characteristics

Serverless guru code challenge n5. The implementation of this challenge has been materialised as a backend for a 'Wedding list' app. It's main purpose is to provide an example of how to implement a serverless architecture with Api gateway and Dynamodb built with the [Serverless Framework](https://www.serverless.com/) and [Typescript](https://www.typescriptlang.org/).

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Folder Structure](#folder-structure)
- [Plugins](#plugins)
- [CI/CD](#cicd)
  - [Unit testing](#unit-testing)
  - [E2E testing](#e2e-testing)


## Installation

Install dependencies:
```bash
pnpm install
```
This project uses the following packages:
  - [pnpm](https://pnpm.io/) as a package manager. 
  - [jest](https://jestjs.io/) as a testing framework.
  - [eslint](https://eslint.org/) as a linter.
  - [prettier](https://prettier.io/) as a code formatter. Used through eslint.
  - [github actions](https://github.com/features/actions) as a CI/CD.
  - [DynamoDB OneTable](https://doc.onetable.io/start/quick-tour/) as a database wrapper.
  - [middy](https://github.com/middyjs/middy) as a middleware.
  - [zod](https://github.com/colinhacks/zod) as a schema validation.

## Usage

To deploy the project run this command in the root folder :
```bash
pnpm sls deploy
```
Remember you need proper AWS credentials. For reference, check [AWS credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials). 
As of Serverless Framework V4 there have been some licensing changes that require you to have a [Serverless Account](https://www.serverless.com/framework/docs/guides/upgrading-v4#license-changes). You need a `SERVERLESS_ACCESS_KEY` configured at https://github.com/ebisbe/serverless-guru-code-challenge/settings/secrets/actions. The key is free to get from the Serverless Dashboard. 

## Project Structure

As defined by the challenge we need to use Api Gateway to access the resources. We have two endpoints:
  - `/list/{?id}`
  - `/list/{listId}/item/{id}`
  
We have defined the following method operations `GET` `POST`, `PATCH` and `DELETE`. 

This project uses the single database pattern for DynamoDb. All the data is stored in a single table. We have defined a Primary Key ( pk ) and a Secondary Key ( sk ) as the Key Schema. We have also enabled streams to be able to update related changes. 

For example after we create a list that list contains 0 items and a total price of 0. When we add an item to that list, the total price will be updated and the number of items will be increased by 1 throgh the streams. 
The streams are connected to an AWS Pipe that sends any `Item` change as a new Event to an EventBus. We can know if the change proceeds from an Item thanks to the attribute `__typeName`.

We have added a rule that will format the event and send it to an AWS StepFunction. There we will check what kind of event ( CREATE, MODIFY, REMOVE ) to do proper update on the parent `List` item.

## Folder Structure

All the project files are in the `src` folder. The structure is the following:

```
└── src
    ├── functions
    ├── models
    ├── resources
    ├── stepFunctions
    ├── types
    └── utils
```

  - `functions`: contains all the lambda functions of the project. As the implementation of this challenge, there are 4 functions: `create`, `get`, `update` and `delete`. Each of those are grouped in a folder with the resource their are related to. Tests are also included for each function.
  - `models`: contains all the information related to the database. We are using [Dynamodb OneTable](https://doc.onetable.io/start/quick-tour/) package for this challenge. With one schema we can define multiple models with default values, attributes types, any primary and secondary indexes. 
  - `resources`: contains all the Cloud Formation resources that are used in the project. It's all typed thanks to [@awboost/cfntypes](https://github.com/awboost/cfntypes) package. It's meant to be used as a reference.
  - `stepFunctions`: contains all the step functions that are used in the project. 
  - `types`: contains all the types used for resources, the helper functions to avoid linting errors and an enhanced version of the default Serverless Types.
  - `utils`: contains all the utils functions used by the project that don't have a proper place in another folder.

## Plugins
  This project is using 3 Sls plugins:
  - `serverless-iam-roles-per-function`: Lets you define IAM roles per function. It's a good practice to avoid having the same role for all functions.
  - `serverless-step-functions`: Lets you define step functions. This is used in the project to create the state machines.
  - `serverless-plugin-scripts`: Lets you run scripts before and after deploy. The only usage for this project is to generate an `env.e2e` file to be able to run the E2E tests right after the deploy.

## CI/CD

  The CI/CD pipeline is using [Github Actions](https://docs.github.com/en/actions). It's configured to run on every push to main or pull request. There are 2 action scripts:

  - `deploy-sls.yml`: Deploys the project with serverless. When the commit it is from a PR it generates a different stage for that PR with `pr<number>` otherwise defaults to `dev`.
  - `remove-sls.yml`: Removes the project after a closed PR event is triggered. 

  ### Unit testing

  To run the unit tests execute:
  ```bash
  pnpm test
  ```
  The unit tests for all the lambdas are under `__tests__` folder on each `src/functions/{model}` folder. We are using [Jest](https://jestjs.io/) to run them with [jest-dynalite](https://github.com/mhart/jest-dynalite) as a mock for the DynamoDB.

  Those tests use `jest.config.ddb.cjs` configuration.

  ### E2E testing

  To run the E2E tests execute:
  ```bash
  pnpm test-e2e
  ```

  The E2E test is under `__tests__/e2e.test.js`. The single test covers creation of a new List and Item. Also is covering the pipes triggers from each DynamoDb stream and EBS rules.
  After each deploy a `.env.e2e` file is generated with the endpoint to be able to run the tests. 

# Nuber Eats

The Backend of Nuber Eats Clone

## User Model:

- id
- createdAt
- updatedAt

- email
- password
- role(client|owner|delivery)

## User CRUD:

- Create Account
- Log In
- See Profile
- Edit Profile
- Verify Email

## 0.6 Backend Setup

터미널에 npm i -g @nestjs/cli@7.0.0 입력하여 nest 설치

터미널에 nest g application 입력

What name would you like to use for the new project?
-> nuber-eats-backend 입력

nuber-eats-backend 디렉토리로 이동

nest-cli.json package.json README.md src test tsconfig.build.json tsconfig.json 파일 및 디렉토리가 생성됨

package.json 파일을 수정하고 터미널에 npm i 입력 했을 때 ERESOLVE unable to resolve dependency tree 에러 발생
-> npm i --legacy-peer-deps를 입력하여 해결

터미널에 npm run start:dev 입력

localhost:3000 접속하면 Hello World! 나옴

github.com/new에서 repository name과 description을 작성하고 public으로 repository 생성

터미널에 git init 입력

터미널에 git remote add origin https://github.com/kko0831/nuber-eats-backend.git 입력

CodeZombie의 gitignore extension을 설치

vscode 왼쪽 아래에 있는 톱니바퀴를 클릭하여 comman palette 선택

gitignore를 입력하여 add gitignore를 선택

node를 입력하여 node.gitignore 선택하면.gitignore 파일이 생성됨

## 1.0 Apollo Server Setup

터미널에 npm i @nestjs/graphql@7.6.0 apollo-server-express@2.17.0 graphql@15.3.0 graphql-tools@6.2.3 --legacy-peer-deps 입력

터미널에 npm run start:dev 입력하면 Apollo Server requires either an existing schema, modules or typeDefs 에러 발생
-> 뒤에서 해결 예정

## 1.1 Our First Resolver

터미널에 nest g mo restaurants 입력

src\restaurants\restaurants.resolver.ts 수정

```javascript
@Query(() => Boolean)
  isPizzaGood(): boolean {
    return true;
  }
```

터미널에 npm run start:dev 입력하여 localhost:3000 접속하면 error: Not Found 화면 나옴

localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  isPizzaGood: Boolean!
}
```

볼 수 있음

## 1.2 ObjectType

src\restaurants\entities\restaurant.entity.ts 수정

```javascript
@Field(() => String)
  name: string;

@Field(() => Boolean, { nullable: true })
  isGood?: boolean;
```

src\restaurants\restaurants.resolver.ts 수정

```javascript
@Query(() => Restaurant)
  myRestaurant() {
    return true;
  }
```

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  myRestaurant: Restaurant!
}

type Restaurant {
  name: String!
  isGood: Boolean
}
```

볼 수 있음

playground에서

```javascript
query {
  myRestaurant {
    isGood
  }
}
```

입력하면

```javascript
"data": {
    "myRestaurant": {
      "isGood": null
    }
  }
```

나옴

## 1.3 Arguments

src\restaurants\restaurants.resolver.ts 수정

```javascript
@Query(() => [Restaurant])
  restaurants(@Args("veganOnly") veganOnly: boolean): Restaurant[] {
    return [];
  }
```

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  restaurants(veganOnly: Boolean!): [Restaurant!]!
}

type Restaurant {
  name: String!
  isGood: Boolean
}
```

볼 수 있음

playground에서

```javascript
query {
  restaurants(veganOnly: true) {
    name
  }
}
```

입력하면

```javascript
"data": {
    "restaurants": []
  }
```

나옴

## 1.4 InputTypes and ArgumentTypes

src\restaurants\dtos\create-restaurant.dto.ts 수정

```javascript
@Field(() => String)
name: string;
@Field(() => Boolean)
isVegan: boolean;
@Field(() => String)
address: string;
@Field(() => String)
ownersName: string;
```

src\restaurants\entities\restaurant.entity.ts 수정

```javascript
@Field(() => Boolean)
isVegan: boolean;

@Field(() => String)
address: string;

@Field(() => String)
ownersName: string;
```

src\restaurants\restaurants.resolver.ts 수정

```javascript
@Mutation(() => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log(createRestaurantDto);
    return true;
  }
```

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createRestaurant(
    name: String!
    isVegan: Boolean!
    address: String!
    ownersName: String!
  ): Boolean!
}

type Restaurant {
  name: String!
  isVegan: Boolean!
  address: String!
  ownersName: String!
}
```

볼 수 있음

playground에서

```javascript
mutation {
  createRestaurant(
    name: ""
    isVegan: true
    address: ""
    ownersName: ""
  )
}
```

입력하면

```javascript
"data": {
    "createRestaurant": true
  }
```

나옴

터미널에는

```javascript
{ name: '', isVegan: true, address: '', ownersName: '' }
```

나옴

## 1.5 Validating ArgsTypes

터미널에 npm i class-validator@0.12.2 입력

터미널에 npm i class-transformer@0.3.1 입력

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  createRestaurant(
    name: "5자 미만"
    isVegan: true
    address: ""
    ownersName: ""
  )
}
```

입력하면

```javascript
"message": [
              "name must be longer than or equal to 5 characters"
            ]
```

나옴

```javascript
mutation {
  createRestaurant(
    name: "10자 초과"
    isVegan: true
    address: ""
    ownersName: ""
  )
}
```

입력하면

```javascript
"message": [
              "name must be shorter than or equal to 10 characters"
            ]
```

나옴

## 2.2 Windows Setup

PostgreSQL 다운로드 및 설치
-> devkuma.com/books/pages/1425

pgAdmin4 실행 후 server 생성함

nuber-eats라는 이름의 database를 생성함

Login/Group Roles->postgres->Definition에서 password 변경 가능함

## 2.3 TypeORM Setup

터미널에 npm install --save @nestjs/typeorm@7.1.4 pg@8.3.3 typeorm@0.2.26 입력

터미널에 npm run start:dev 입력하면 백엔드와 DB가 연결됨

## 2.4 Introducing ConfigService

터미널에 npm i --save @nestjs/config@0.5.0 입력

루트 디렉토리에 .env.dev 파일 생성

루트 디렉토리에 .env.test 파일 생성

터미널에 npm i cross-env@7.0.2 입력

.gitignore에 .env.dev 추가

## 2.5 Configuring ConfigService

package.json 수정

.env.dev 작성

```javascript
DB_HOST = localhost;
DB_PORT = 5432;
DB_USERNAME = postgres;
DB_PASSWORD = DB 비밀번호;
DB_NAME = nuber - eats;
```

터미널에 npm run start:dev 입력하여 백엔드 동작 확인

## 2.6 Validating ConfigService

터미널에 npm i joi@17.2.1 입력

터미널에 npm run start:dev 입력하여 환경변수의 유효성 확인

src\app.module.ts의 validationSchema에서 NODE_ENV에 "dev"나"prod"가 아닌 것을 넣으면

```javascript
Error: Config validation error: "NODE_ENV" must be [넣은 내용]
```

.env.dev의 DB_PASSWORD를 지우면 에러 발생

```javascript
Error: Config validation error: "DB_PASSWORD" is required
```

## 3.0 Our First Entity

src\restaurants\entities\restaurant.entity.ts 수정

```javascript
@PrimaryGeneratedColumn()
@Field(() => Number)
id: number;

@Field(() => String)
@Column()
categoryName: string;
```

터미널에 npm run start:dev 입력하면 DB에 restaurant 테이블 생성됨

pgAdmin에서 restaurant 테이블에 id, name, isVegan, address, ownersName, categoryName Column이 있음

## 3.2 Injecting The Repository

src\restaurants\entities\restaurant.entity.ts에서 graphql schema의 id type을 Int로 수정

```javascript
@PrimaryGeneratedColumn()
@Field(() => Int)
id: number;
```

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Restaurant {
  id: Int!
  name: String!
  isVegan: Boolean!
  address: String!
  ownersName: String!
  categoryName: String!
}
```

볼 수 있음

playground에서

```javascript
query {
  restaurants {
    id
  }
}
```

입력하면

```javascript
"data": {
    "restaurants": []
  }
```

나옴

## 3.4 Create Restaurant

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  createRestaurant(
    name: "kko is a"
    isVegan: false
    address: "123"
    ownersName: "123"
  )
}
```

입력하면

```javascript
"data": {
    "createRestaurant": false
  }
```

나옴

터미널에 "categoryName" 칼럼의 null 값이 not null 제약조건을 위반했습니다. 에러 발생
-> 뒤에서 해결 예정

## 3.6 Optional Types and Columns

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createRestaurant(input: CreateRestaurantDto!): Boolean!
}

input CreateRestaurantDto {
  name: String!
  isVegan: Boolean
  address: String = "송파"
}
```

볼 수 있음

```javascript
mutation {
  createRestaurant(
    input: {
      name: "Without isVegan"
    }
  )
}
```

입력하면

```javascript
"data": {
    "createRestaurant": true
  }
```

나옴

createRestaurant을 mutation할때 input field에 isVegan과 address를 안 넣어도 pgAdmin의 restaurant 테이블에 생성된 record의 isVegan이 true, address가 송파로 됨

터미널에는

```javascript
[Object: null prototype] { name: 'Without isVegan', address: '송파' }
```

나옴

## 3.7 Update Restaurant part One

src\restaurants\dtos\update-restaurant.dto.ts에서 graphql schema의 id type을 Int로 수정

```javascript
@Field(() => Int)
  id: number;
```

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createRestaurant(input: CreateRestaurantDto!): Boolean!
  updateRestaurant(input: UpdateRestaurantDto!): Boolean!
}

input UpdateRestaurantDto {
  id: Int!
  data: UpdateRestaurantInputType!
}

input UpdateRestaurantInputType {
  name: String
  isVegan: Boolean
  address: String = "송파"
}
```

볼 수 있음

```javascript
mutation {
  updateRestaurant(
    input: {
      id: 3
      data: {
        name: "Without isVegan"
      }
    }
  )
}
```

입력하면

```javascript
"data": {
    "updateRestaurant": true
  }
```

나옴

## 3.8 Update Restaurant part Two

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  updateRestaurant(
    input: {
      id: 3
      data: {
        name: "Updated"
        isVegan: false
      }
    }
  )
}
```

입력하면

```javascript
"data": {
    "updateRestaurant": true
  }
```

나옴

updateRestaurant을 mutation할때 restaurant의 id를 선택하고 name과 isVegan 값을 바꾸면 pgAdmin의 restaurant 테이블에 있는 해당 record의 name과 isVegan 값이 바뀜

## 4.1 User Model

터미널에 nest g mo users 입력

터미널에 nest g mo common 입력

터미널에 npm run start:dev 입력하면 DB에 user 테이블 생성됨

pgAdmin에서 user 테이블에 id, createdAt, updatedAt, email, password, role Column이 있음

resolver 작업을 안 해서 GraphQLError [Object]: Query root type must be provided. 에러가 나오는데 뒤에서 해결 예정

## 4.2 User Resolver and Service

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  hi: Boolean!
}
```

볼 수 있음

playground에서

```javascript
query {
  hi
}
```

입력하면

```javascript
"data": {
    "hi": true
  }
```

나옴

## 4.3 Create Account Mutation part One

src\common\entities\core.entity.ts에서 graphql schema의 id type을 Int로 수정

```javascript
@PrimaryGeneratedColumn()
@Field(() => Int)
id: number;
```

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
}

input CreateAccountInput {
  email: String!
  password: String!
  role: String!
}

type CreateAccountOutput {
  error: String
  ok: Boolean!
}
```

볼 수 있음

## 4.4 Create Account Mutation part Two

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
input CreateAccountInput {
  email: String!
  password: String!
  role: UserRole!
}

enum UserRole {
  Client
  Owner
  Delivery
}
```

볼 수 있음

## 4.5 Create Account Mutation part Three

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  createAccount(input: {
    email: "nico@las.com"
    password: "12345"
    role: Client
  }) {
    ok
    error
  }
}
```

입력하면

```javascript
"data": {
    "createAccount": {
      "ok": true,
      "error": null
    }
  }
```

나옴

createAccount를 mutation하면 pgAdmin의 user 테이블에 record가 생성됨

## 4.6 An Alternative Error

error를 처리하는 방식 수정함

## 4.7 Hashing Passwords

데이터베이스에 비밀번호를 바로 입력하는 것은 나쁜 보안 방법이므로 password를 hash함

pgAdmin의 user 테이블에 있는 record를 삭제함

터미널에 npm i bcrypt@5.0.0 입력

터미널에 npm i @types/bcrypt@3.0.0 --dev-only 입력

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  createAccount(input: {
    email: "nico@las.com"
    password: "12345"
    role: Client
  }) {
    ok
    error
  }
}
```

입력하면

```javascript
"data": {
    "createAccount": {
      "ok": true,
      "error": null
    }
  }
```

나옴

createAccount를 mutation하면 pgAdmin의 user 테이블에 record가 생성되고 password가 hash됨

## 4.8 Log In part One

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
}

input LoginInput {
  email: String!
  password: String!
}

type LoginOutput {
  error: String
  ok: Boolean!
  token: String!
}
```

볼 수 있음

playground에서

```javascript
mutation {
  login(input: {
    email: "nico@las.com"
    password: "12345"
  }) {
    ok
    error
    token
  }
}
```

입력하면

"Cannot return null for non-nullable field Mutation.login." 에러가 나오는데 뒤에서 해결 예정

## 4.9 Log In part Two

src\users\users.service.ts에 login function을 만듦

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  login(input: {
    email: "nico@las.com"
    password: "12345"
  }) {
    ok
    error
    token
  }
}
```

입력하면

```javascript
"data": {
    "login": {
      "ok": true,
      "error": null,
      "token": "lalalalalala"
    }
  }
```

나옴

password를 다르게 입력하면

```javascript
"data": {
    "login": {
      "ok": false,
      "error": "Wrong password",
      "token": null
    }
  }
```

나옴

## 5.1 Generating JWT

token을 만듦

터미널에 npm i jsonwebtoken@8.5.1 입력

터미널에 npm i @types/jsonwebtoken@8.5.0 --only-dev 입력

.env.dev에 SECRET_KEY 추가

SECRET_KEY=randomkeygen.com 사이트의 CodeIgniter Encryption Keys에 있는 임의의 key를 넣음

## 5.2 JWT and Modules

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  login(input: {
    email: "nico@las.com"
    password: "12345"
  }) {
    ok
    error
    token
  }
}
```

입력하면

```javascript
"data": {
    "login": {
      "ok": true,
      "error": null,
      "token": jwt.sign된 token 값
    }
  }
```

나옴

jwt.io 사이트의 Encoded에 생성된 token을 넣으면 payload(data)를 볼 수 있음

터미널에 nest g mo jwt 입력

static module은 어떠한 설정도 적용되어 있지 않은 module임

dynamic module은 설정이 존재하는 module임

## 5.3 JWT Module part One

터미널에 nest g s jwt 입력하고 jwt.service 작성

src\jwt\jwt.service.spec.ts 파일 삭제

## 5.4 JWT Module part Two

global jwt module을 만듦

.env.dev에 있는 SECRET_KEY를 PRIVATE_KEY로 바꿈

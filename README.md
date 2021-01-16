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

## 5.5 JWT Module part Three

users.service에 있는 jwt.sign을 sign할때 JwtService를 쓰도록 만듦

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

jwt.io 사이트의 Encoded에 생성된 token을 넣으면 payload(data)가 나오지 않음

## 5.6 Middlewares in NestJS

middleware를 사용하는 방식은 bootstrap()에서 사용할 수 있는 방법이 있고 어플리케이션 전체에서 사용 가능함

다른방식으로는 AppModule에서 comsumer를 사용하고 어떤 경로에 middleware를 제외 또는 적용 시켜줄지 정하는 방법이 있음

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
query {
  me {
    email
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"message": "Cannot return null for non-nullable field Query.me.",
```

나옴

터미널에서 req.headers 값을 볼 수 있음

## 5.7 JWT Middleware

headers에서 user를 request에 보내는 middleware 구현

## 5.8 GraphQL Context

graphql로 request를 공유함

request를 graphql resolver에 전달함

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
query {
  me {
    email
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "me": {
      "email": "nico@las.com"
    }
  }
```

나옴

## 5.9 AuthGuard

터미널에 nest g mo auth 입력

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
query {
  me {
    email
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"message": "Cannot return null for non-nullable field Query.me."
```

나옴

시크릿 모드에서 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
query {
  me {
    email
  }
}
```

```javascript
"message": "Forbidden resource"
```

나옴

authentication은 누가 자원을 요청하는지 확인하는 과정

token으로 identity를 확인함

authorization은 user가 어떤 일을 하기 전에 permission을 가지고 있는지 확인하는 과정

## 5.10 AuthUser Decorator

login 되어있지 않다면 request를 멈추게 함

login 되어있다면 request를 진행시킴

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
query {
  me {
    email
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "me": {
      "email": "nico@las.com"
    }
  }
```

나옴

## 5.11 Recap

authentication이 어떻게 작동하는지 정리함

header에 token을 보냄

header는 http 기술에 쓰임

http 기술을 쓰기 위해서 middleware를 만듦

middleware는 header를 가져다가 jwtService.verify()를 사용함

user id를 찾게 되면 userService를 사용해 해당 id를 가진 user를 찾음

userService는 typeorm의 findOne 함수를 쓰는 findById function을 가지고 있음

db에서 user를 찾으면 그 user를 request object에 붙여서 보냄

app.modlue에서 context를 보면 apollo server의 context나 graphql의 context는 모든 resolver에 정보를 보낼 수 있는 property임

context에서 function을 만들면 그 function이 request object를 줌

request object는 user key를 가진 http에 해당됨

먼저 JwtMiddleware를 거치고 graphql context에 request user를 보냄

users resolver를 보면 guard가 있음 

guard는 canActivate function의 기능을 보충함

canActivate function은 true나 false를 return 해야함

true를 return하면 request를 진행시키고 false를return하면 request를 중지시킴

header에 token을 보내는 걸로 시작해서 token을 decrypt, verify하는 middleware를 거쳐 request object에 user를 추가함

request object가 graphql context 안으로 들어가게 되고 guard가 graphql context를 찾아 user가 있는지 없는지에 따라 true, false를 return 함

guard에 의해 request가 authorize되면 resolver에 decorator가 필요함

decorator는 graphql context에서 찾은 user와 같은 user를 찾으려고 함

같은 graphql context의 user를 찾고 return 함

## 5.12 userProfile

user의 profile을 볼 수 있는 query를 추가함

src\users\dtos\user-profile.dto.ts에서 graphql schema의 userId type을 Int로 수정

```javascript
@Field(() => Int)
userId: number;
```

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  me: User!
  userProfile(userId: Int!): UserProfileOutput!
}

type UserProfileOutput {
  error: String
  ok: Boolean!
  user: User
}

type User {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  email: String!
  password: String!
  role: UserRole!
}
```

볼 수 있음

playground에서

```javascript
query {
  me {
    id
    email
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "me": {
      "id": 2,
      "email": "nico@las.com"
    }
  }
```

나옴

playground에서

```javascript
query {
  userProfile(userId: 2) {
    ok
    error
    user {
      id
    }
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "userProfile": {
      "ok": true,
      "error": null,
      "user": {
        "id": 2
      }
    }
  }
```

나옴

## 5.13 updateProfile part One

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
  editProfile(input: EditProfileInput!): EditProfileOutput!
}

input EditProfileInput {
  email: String
  password: String
}

type EditProfileOutput {
  error: String
  ok: Boolean!
}
```

볼 수 있음

playground에서

```javascript
query {
  me {
    email
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "me": {
      "email": "nico@las.com"
    }
  }
```

나옴

playground에서

```javascript
mutation {
  editProfile(input: {
    email: "nico@nomad.com"
  }) {
    ok
    error
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"message": "\"password\" 칼럼의 null 값이 not null 제약조건을 위반했습니다."
```

나옴

뒤에서 해결 예정

## 5.14 updateProfile part Two

password column을 null로 만들려 하고 있고 password column은 null이면 안 됨

editProfile을 mutation 했을 때 password column에 null value를 보냄

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  editProfile(input: {
    email: "nico@nomad.com"
  }) {
    ok
    error
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "editProfile": {
      "ok": true,
      "error": null
    }
  }
```

나옴

playground에서

```javascript
query {
  me {
    email
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "me": {
      "email": "nico@nomad.com"
    }
  }
```

나옴

playground에서

```javascript
mutation {
  editProfile(input: {
    password: "15151515"
  }) {
    ok
    error
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "editProfile": {
      "ok": true,
      "error": null
    }
  }
```

나옴

password에 대한 editProfile을 mutation하면 pgAdmin의 user 테이블에 바뀐 password가 hash되지 않음

users.service에서 update를 호출하고 있는데 user.entity의 @BeforeUpdate를 부르지 못 함

뒤에서 해결 예정

## 5.15 updateProfile part Three

typeorm이 BeforeUpdate hook을 부르지 못 함

users repository에서 this.users.update()를 쓰고 있음

update()는 엄청 빠르고 효율적으로 query를 update함

entity가 있는지 없는지는 확인하지 않음

그저 db에 query만 보냄

BeforeUpdate는 특정 entity를 update 해야 부를 수 있음

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  editProfile(input: {
    password: "123123123"
  }) {
    ok
    error
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "editProfile": {
      "ok": true,
      "error": null
    }
  }
```

나옴

password에 대한 editProfile을 mutation하면 pgAdmin의 user 테이블에 바뀐 password가 hash 됨

playground에서

```javascript
mutation {
  login(input: {
    email: "nico@nomad.com"
    password: "123123123"
  }) {
    ok
    token
    error
  }
}
```

입력하면

```javascript
"data": {
    "login": {
      "ok": true,
      "token": "jwt.sign된 token 값",
      "error": null
    }
  }
```

나옴

playground에서

```javascript
query {
  me {
    email
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "login mutation 했을 때 생성된 token 값"
}
```

입력하면

```javascript
"data": {
    "me": {
      "email": "nico@nomad.com"
    }
  }
```

나옴

## 6.0 Verification Entity

터미널에 npm run start:dev 입력하면 DB에 verification 테이블 생성됨

pgAdmin에서 verification 테이블에 id, createdAt, updatedAt, code, userId Column이 있음

user 테이블에 verified Column이 추가되었고 그 값은 false임

## 6.1 Creating Verifications

터미널에 npm install uuid@8.3.1 입력

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  createAccount(input: {
    email: "new@account.com"
    password: "121212"
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

createAccount를 mutation하면 pgAdmin의 user 테이블에 record가 생성되고 verified 값이 false가 됨

verification 테이블에 record가 생성되고 userId 값이 3이 됨

## 6.2 Verifying User part One

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
  editProfile(input: EditProfileInput!): EditProfileOutput!
  verifyEmail(input: VerifyEmailInput!): VerifyEmailOutput!
}

input VerifyEmailInput {
  code: String!
}

type VerifyEmailOutput {
  error: String
  ok: Boolean!
}

```

볼 수 있음

playground에서

```javascript
mutation {
  verifyEmail(input: {
    code: "createAccount를 mutation 할 때 생성된 code"
  }) {
    ok
    error
  }
}
```

입력하면

```javascript
"message": "Cannot return null for non-nullable field Mutation.verifyEmail."
```

나옴

verifyEmail을 mutation하면 pgAdmin의 user 테이블에서 해당 record의 verified 값이 true가 됨

## 6.3 Verifying User part Two

account를 verify하면 의도치 않게 password의 hash 또한 바뀌고 있음

password를 verify하면 hash된 것에 또 hash를 하고 있음

그래서 로그인을 시도해보면 false가 나옴

해당 account는 잠겨버림

pgAdmin의 user 테이블에서 verification이 있다는 이유로 해당 record를 지울 수 없음

verification은 user에 의존함

verification은 user를 갖고 있어야 함

그래서 user를 삭제할 수 없음

user.entity.ts와 verification.entity.ts를 수정하고 pgAdmin의 user 테이블에서 해당 record를 지우면 그 user에 해당하는 verification 테이블에서의 record도 삭제됨

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

playground에서

```javascript
mutation {
  createAccount(input: {
    email: "new@account.com"
    password: "121212"
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

users.service.ts를 수정하고

playground에서

```javascript
mutation {
  login(input: {
    email: "new@account.com"
    password: "121212"
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
      "token": "login을 mutation 했을 때 생성되는 token"
    }
  }
```

나옴

playground에서

```javascript
mutation {
  verifyEmail(input: {
    code: "createAccount를 mutation 할 때 생성된 code"
  }) {
    ok
    error
  }
}
```

입력하면

```javascript
"data": {
    "verifyEmail": {
      "ok": true,
      "error": null
    }
  }
```

나옴

verifyEmail을 mutation하면 pgAdmin의 user 테이블에서 해당 record의 verified 값이 true가 되고 password는 바뀌지 않음

## 6.4 Cleaning the Code

기본적으로 resolver가 할 일은 몇 개의 input을 받아다가 service를 return 하는 일임

resolver는 input들을 받아다가 그 input들을 service로 전달해줌

service는 그 input들을 다루는 로직이 정의됨

## 6.5 Mailgun Setup

mailgun.com 사이트에 로그인 함

Dashboard 아래쪽 Sending domains에 샌드박스 도메인이 있음

샌드박스 도메인은 이 도메인으로부터 이메일을 보낸다는 것을 의미함

Settings의 API Keys를 클릭하여 Private API key를 확인함

Sending의 Overview를 클릭하여 Authorized Recipients에 이메일 주소 입력함

Mailgun으로부터 온 이메일을 확인하고 I Agree를 클릭함

Confirm 화면에서 Yes를 클릭하면 Success됨

## 6.6 Mail Module Setup

이메일 모듈을 만듦

터미널에 nest g mo mail 입력

.env.dev에 MAILGUN_API_KEY, MAILGUN_DOMAIN_NAME, MAILGUN_FROM_EMAIL 추가
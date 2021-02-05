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

## 6.7 Mailgun API

메일 서비스를 만듦

이메일을 보내는 함수를 만듦

인증 메일을 보내는 서비스로 확장시킴

터미널에 npm i got@11.7.0 입력

터미널에 npm i form-data@3.0.0 입력

터미널에 npm run start:dev 입력하고 이메일이 온 것을 확인함

## 6.8 Beautiful Emails

mailgun 사이트의 Dashboard 아래쪽 Sending의 Templates에서 원하는 메세지 템플릿을 만들 수 있음

Create Message Template를 클릭하여 Alert template를 선택함

Editor에서 Warnig 문구를 Please Confirm your email로 수정(text 바꿈)

title text를 Confirm Nuber Eats Account로 수정함

Name에 verify-email을 입력함

Editor에서 You have 문구를 Hello {{username}}!으로 수정(text 바꿈)

Add your 문구를 Please confirm your account!로 수정(text 바꿈)

Upgrade my account 문구를 Click Here To Confirm으로 수정(text 바꿈)

Thanks for choosing 문구를 Thanks for choosing Nuber Eats로 수정(text 바꿈)

77번째 줄에서 a 태그의 ref를 "http://localhost:3000/confirm?code={{code}}"로 수정

Unsubscribe from these alerts 문구 삭제(text 지움)

터미널에 npm run start:dev 입력하고 이메일이 온 것을 확인함

## 6.9 Refactor

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

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

pgAdmin의 verification 테이블에 있는 record를 삭제함

playground에서

```javascript
mutation {
  editProfile(input: {
    email: "lilili@lololo.com"
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

이메일이 온 것을 확인함

Click Here To Confirm 버튼을 클릭하면 확인코드가 나옴

## 7.0 Setting Up Tests

REST Client extension을 설치함
 
Send Request를 클릭하면 mutation이 되고 response를 볼 수 있도록 restClient.http 파일을 작성함 

유저 서비스에는 많은 로직이 있기 때문에 테스트 해야 함

모든 기능에 대해서 Unit Test(UT)를 해야 함

resolver에 대해서도 테스트를 함

package.json의 jest의 testRegex에서 spec.ts를 찾기 때문에 파일명에 spec.ts가 있어야 함

NestJS에 새로운 모듈이나 서비스, 클래스를 만들 때마다 자동적으로 spec 파일을 제공함

유저 서비스의 첫 테스트를 만듦

테스트 할 많은 todo들을 만들었고 테스트 모듈을 만듦

NestJS는 테스트 패키지를 가지고 있음

테스트 패키지는 유저 서비스만을 가진 독립된 모듈을 제공해 줌

유닛 테스트의 포인트는 가능한 한 테스트들을 독립시키는 것

모든 테스트는 독립적으로 시행해야 함

터미널에 npm run test:watch 입력하면 Cannot find module 'src/common/entities/core.entity' from 'users/entities/user.entity.ts' 에러가 나오는데 뒤에서 해결 예정

## 7.1 Mocking

에러는 경로 문제임

jest가 코드의 경로를 찾지 못 함

Mock은 가짜 함수임

유저 서비스를 단독으로 테스트하기 위해 Mock을 이용함

fn은 mock 함수를 만듦

터미널에 npm run test:watch 입력하고 a를 누름

## 7.2 Mocking part Two

서비스 메서드의 createAccount 함수를 테스트 함

createAccount 함수를 분리해서 테스트 함

함수의 출력물이 아니라 함수의 모든 부분을 테스트 함

유닛 테스트에서 하고 싶은건 코드의 각 줄에 문제가 없나 하는 것

src\users\users.service.spec.ts에서 type MockRepository는 Repository의 모든 함수를 말하는데 이 함수들의 type이 jest.Mock 함수임

## 7.3 Writing Our First Test

첫 테스트를 만듦

mock은 함수의 반환값을 속일 수 있음

유저가 존재한다고 속임

터미널에 npm run test:watch 입력하고 a를 누름

## 7.4 Recap

코드가 어떻게 반응하는지 보기 위해서 jest와 mock을 이용해 코드에서 특정 부분의 리턴값을 속임

가짜 변수로 코드 자체를 테스트 함

테스트 중인 실제 코드로 들어가서 값을 바꿈

## 7.5 createAccount Test part One

createAccount를 테스트 함

터미널에 npm run test:cov를 입력하면 모든 코드의 테스트가 어디까지 커버되고 있는지 보여줌

터미널에 npm run test:watch 입력하고 a를 누름

터미널에 npm run test:cov를 입력하여 얼마만큼 테스트로 커버했는지 봄

## 7.6 createAccount Test part Two

모든 return value를 다 mock 했음

value를 다 mock 했으면 service를 호출하고 expect하기 시작함

arguments와 함께 create가 1번 호출되는 것을 expect 함

터미널에 npm run test:watch 입력하고 a를 누름

## 7.7 login Test part One

mocking 덕분에 function의 value를 명시할 수 있고, function의 행동도 명시할 수 있음

userRepository.findOne이 fail할거라고 명시함

일부러 fail하게 test 할 수 있음

login test에서 findOne은 user를 찾지 못 하면 fail 함

password가 정확하지 않으면 fail 함

findOne의 return value를 false로 mock 함

mock 먼저 하고 그 후 expect를 함

toHaveBeenCalledWith는 두 개의 object와 함께 call 되어야 함

findOne function과 code 부분을 함께 test 함

터미널에 npm run test:watch 입력하면 findOne의 Expected number of calls가 1이었으나 Received number of calls가 4라는 에러가 발생하는데 뒤에서 해결 예정

## 7.8 login Test part Two

모든 테스트에서 기본적으로 동일한 mocks를 공유하고 있기 때문임

function을 4번 call하면서 jest의 메모리에 들어감

jest는 총 4번 call한 것을 기억함

findOne의 return value를 mock 함

return value 안에는 checkPassword function도 있어야 함

users.findOne의 return value를 mock 함

users.findOne은 id와 checkPassword function이 포함되어 있는 user object를 return 함

checkPassword function은 boolean을 return 함

return value가 아니라 return value에 대한 코드의 반응을 test 함

expect를 써서 jwtService를 숫자와 함께 call 함

터미널에 npm run test:watch 입력하고 a를 누름

터미널에 npm run test:cov를 입력하여 얼마만큼 테스트로 커버했는지 봄

## 7.9 findById Test

findById를 describe 함

만약 찾으면 user를 return할거고, 못 찾으면 error가 나옴

findOneOrFail의 return value를 mock 함

exception에 test도 만듦

터미널에 npm run test:watch 입력하고 a를 누름

## 7.10 editProfile Test part One

new email을 써서 editProfile을 call 함

editProfile을 call할 때 userId를 같이 보내야함

result를 먼저 mock 해야함

findOne은 userId와 call 되어야 하지만 oldUser를 return 해야함

create의 return value부터 mock 함

return value와 resolved value의 차이는 create가 promise를 return하지 않음

mailService는 new email과 code로 call 됨

sendVerificationEmail이 new email과 code로 함께 call 되어야 한다는 것을 expect 해야함

verificationsRepository.save는 newVerification과 함께 call 해야함

verificationsRepository.create는 object와 함께 call 해야함

터미널에 npm run test:watch 입력하고 a를 누름

## 7.11 editProfile Test part Two

change password를 함

findOne의 return value를 mock 함

old password의 resolved value를 먼저 mock 함

usersRepository.save는 new password와 함께 call 됨

findOne이 처음에 password: old를 return 함

코드 상에서 password가 변할 때 어떻게 되는지를 체크할 수 있음

mocking을 쓰는 이유는 코드의 return value에 영향을 주고 싶어서임

한 행이 어떻게 바뀌는지, 코드가 어떻게 반응하는지 보고 싶어서임

findOne에 error를 raise 함

터미널에 npm run test:watch 입력하고 a를 누름

## 7.12 verifyEmail Test

터미널에 npm run test:watch 입력하고 a를 누름

## 7.13 Conclusions

터미널에 npm run test:cov를 입력하여 얼마만큼 테스트로 커버했는지 봄

user service를 100퍼센트 test 함

코드의 조건 하나하나를 체크하기 위해서 mock 함

## 8.0 JWT Service Test Setup

dependency는 기본적으로 어떤 서비스가 동작하기 위해 무언가에 의존해야 한다는 뜻임

CONFIG_OPTIONS는 privateKey: string의 형태여야 함

터미널에 npm run test:watch 입력하고 a를 누름

## 8.1 JWT Sign Test

sign 테스트를 구현함

JWT는 Json web token npm package의 약자임

sign은 user ID를 필요로 함

Json web token을 mock 함

jwt를 실제 JWT package로부터 사용하지 않음

jwt.sign은 id: user id를 가진 object, 그리고 options로 보낸 privateKey와 함께 불러야 함

private key로 제공한 TEST_KEY가 jwt sign에서 사용되는지를 테스트 함

service.sign의 반환값을 체크함

## 8.2 JWT Verify Test

mock verify가 필요함

verify는 payload를 return 함

decode된 token을 return 해야함

jest가 자동으로 로드하기 때문에 describe나 beforeEach를 import할 필요가 없음

got를 mock 해야됨

form data의 mock도 필요함

mail service setup을 완료함

jwt test도 했음

터미널에 npm run test:watch 입력하고 a를 누름

터미널에 npm run test:cov를 입력하여 얼마만큼 테스트로 커버했는지 봄

## 8.3 sendVerificationEmail Test

sendVerificationEmail은 sendEmail을 불러야 함

sendEmail이 한번 호출된 것을 테스트하고 sendVerificationEmail이 아무것도 반환하지 않았음을 테스트 함

sendEmail이 문자열, 문자열, 오브젝트의 배열로 호출되었는지를 확인함

인자의 type을 체크하고 싶은건지, 인자의 값을 체크하고 싶은건지를 생각해야 함

인자의 값을 체크함

private인 상태에서는 test 할 수 없으니까 private을 없앰

jest는 함수를 mock function으로 만들지 않으면 그 함수를 spying 할 수 없음

users testing 전에 repositories를 mock으로 만들었음

sendEmail에 spying을 함

함수를 mock 할 수 없을 때 spy를 씀

sendEmail이 호출됐을 때, 그 콜을 가로채서 구현(implementation)을 추가할 수 있음

service.sendVerificationEmail()을 호출하면 service.sendVerificationEmail()이 sendEmail()을 호출함

sendEmail은 spyOn하고 있었던 함수임

spy를 가지게 되었으니, spy로부터 expect하는 것도 가능해짐

터미널에 npm run test:watch 입력하고 a를 누름

## 8.4 sendEmail Test

got 자체를 mock 함

got랑 formData는 mock 함수임

form.append가 호출되고 있는지 확인해야 함

got가 string과 object를 가지고 실행되는지 확인해야 함

jest에서 post의 implementation을 mock 할 수 있음

sendEmail을 호출하고 sendEmail이 got.post를 호출할 때, implementation을 mock하게 되고 error를 throw하게 됨

터미널에 npm run test:watch 입력하고 a를 누름

터미널에 npm run test:cov를 입력하여 얼마만큼 테스트로 커버했는지 봄

## 9.0 Setup part One + 9.1 Setup part Two

User 모듈의 end-to-end test를 함

end-to-end test를 하기 위해서 기본적으로 Resolver를 테스트 함

Resolver를 전부 호출하고 결과를 예측함

기본적으로 전체 application을 load해서, Resolver를 테스트할 수 있기를 원함

package.json 내부에 있는 jest configuration은 unit test를 위한 jest 환경 설정임

jest-e2e.json에서 e2e test의 설정을 구성함

e2e test가 src로 시작하는 경로를 보면 rootDir로 가서, 그 다음 rootDir을 빠져나가서 src 내부로 가게 됨

test 명령으로 실행을 하게 되면 NODE_ENV는 test가 됨

.env.dev 파일의 내용을 .env.test로 복사함

.env.test의 DB_NAME을 nuber-eats-test로 변경

실제로 user를 생성해서 테스트를 함

database에 실제로 relationship을 만듦

실제 TypeORM SQL 코드를 실행시킴

.env.test의 PRIVATE_KEY를 변경함

더 많은 오류를 보기 위해 beforeEach를 beforeAll로 바꿈

각각의 test 전에 module을 load하지 않고, 모든 test 전에 module을 load하고 싶음

pgAdmin4 실행 후 nuber-eats-test라는 이름의 database를 생성함

터미널에 npm run test:cov를 입력하면 coverage 폴더가 생성되는데 coverage를 포함한 결과를 보여주는 HTML page임

coverage/lcov-report/index.html을 실행하면 coverage를 인터페이스로 제공해줌

Jest did not exit one second after the test run has completed는 뭔가가 종료되지 않은 상태에서 jest가 종료되었기 때문에 뜨는 경고임

application을 종료하는 코드를 넣어줘야 함

test가 다 끝나면, database를 싹 비움

test database를 제대로 생성하고, 나중에 그 database를 드랍해야 함

test가 전부 끝난 후에 database를 drop함

인증을 할 때 진짜 database와 진짜 server에서 test하게 됨

터미널에 npm run test:e2e 입력

## 9.2 Testing createAccount part One

createAccount resolver를 테스트 함

supertest를 이용해서 request를 보냄

post request를 GRAPHQL_ENDPOINT로 보냄

query를 넣어 data를 보냄

user table을 생성한 뒤에, table이 사라짐

database를 만들고, user를 만들고, 다 만든 다음에 유저를 만든 후에 table이 사라지고 싹 비워짐

expect를 들여다보면 expect는 callback을 받고, callback은 error나 response를 넘겨줌

터미널에 npm run start:dev 입력하고 localhost:3000/graphql 접속하여 playground 실행

개발자 도구의 Network 탭에서 query를 보내면 Headers 탭에서 graphql로 보낸 request를 볼 수 있음

Request Payload에서 query 부분을 볼 수 있음

터미널에 npm run test:e2e 입력

## 9.3 Testing createAccount part Two

먼저 account를 만들고 그 다음에 다시 생성 시도를 해야 함

터미널에 npm run test:e2e 입력

## 9.4 Testing login

먼저 로그인 된 상태에서 profile을 볼 수 있게 해야 함

email이랑 password를 기억해야 함

email과 password를 바깥에 전역으로 빼둠

token을 가지고 authenticate하는 작업이 필요함

token을 test에서 가지고 나옴

다른 곳에서도 공유해서 쓸 수 있게 함

token을 바깥에 놓고, 바깥 변수를 업데이트 하는 식으로 씀

터미널에 npm run test:e2e 입력

## 9.5 Testing userProfile

userProfile은 로그인만 되어있다면 어떤 user의 프로필이든 볼 수 있게 해줌

ID만 있다면 어떤 유저의 프로필이든 볼 수 있음

found와 nonfound 여부부터 체크해야 함

user를 만들고 database를 drop하고, 첫 유저는 항상 ID가 1임

database를 싹 다 지운 후 재생성함

usersRepository를 가져올 수 있으니, userProfile을 하기 전에 일단 database에 접근할 수 있음

GraphQL로부터 받은 ID가 query를 부르는데 사용한 것과 동일해야 함

header를 post 뒤에다 set 해야함

터미널에 npm run test:e2e 입력

## 9.6 Testing me

me를 test함

service를 수정했는데, JWT가 service에 의존하고 있었음

authUser를 jwt middleware에서 가져옴

jwt middleware는 findById를 호출함

findById는 ok와 user를 반환함

터미널에 npm run test:e2e 입력

## 9.7 Testing editProfile

editProfile 보안이 약함

원하는 email로 마구 수정할 수 있고, 이미 사용 중인 이메일로의 수정은 막아야 함

email을 수정하기 전에, 해당 email을 가지고 있는 유저가 있는지를 확인해야 함

password랑 email정도만 수정할 수 있게 함

새 verification을 만들기 전에 user의 id가 user.id를 갖는 모든 verification들을 삭제함

unit testing 때는 database가 없었음

한 user가 한 verification만 가질 수 있고, 한 verification당 한 user만 받을 수 있음

터미널에 npm run test:e2e 입력
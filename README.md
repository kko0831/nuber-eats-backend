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

## Restaurant Model

- name
- category
- address
- coverImage

- Edit Restaurant
- Delete Restaurant

- See Categories
- See Restaurants by Category (pagination)
- See Restaurants (pagination)
- See Restaurant
- Search Restaurant

- Create Dish
- Edit Dish
- Delete Dish

- Orders CRUD
- Orders Subscription:

  - Pending Orders (Owner) (T: createOrder)
  - Pending Pickup Order (Delivery)
  - Order Status (Customer, Delivery, Owner) (T: editOrder)  

- Payments (CRON)

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

## 9.8 Testing verifyEmail

verifyEmail은 email에 접근할 수 있는 권한을 요구함

새 database를 만들면 verification이 하나 생기고, 그 verification을 삭제 해야함

email을 변경하기 위해서 다른 verification을 만듦

그 다음 verification의 id는 자연스럽게 2가 됨

verification 하나를 만들고, email을 변경할 때는 삭제한 다음에 새로 하나를 만듦

verify하기 위해서 로그인 해야할 필요는 없음

response 안에는 body가 있고, body 안에는 data가 있고, data 안에는 verifyEmail이 있음

터미널에 npm run test:e2e 입력

## 9.9 Conclusions

baseTest는 기본적으로 모든 test의 기본이 되는 것들을 반환함

publicTest는 query string을 받아서, baseTest의 모든 것에 send query를 추가함

privateTest는 baseTest의 모든 것을 받아서, token을 set하고 string으로 된 query를 받아서 전송함

터미널에 npm run test:e2e 입력

## 10.0 Restaurant Models

restaurant model을 만듦

cover image가 필요함

카테고리를 하나만 가질 수도 있고, 여러 개를 가질 수도 있음

category는 이미지를 가져야 하고, 이 이미지는 관리자에 의해 추가되어야 함

category는 1:N relationship을 가지게 됨

하나의 category가 여러 restaurant들을 가질 수 있음

restaurant은 오직 하나의 category만 가질 수 있음

category는 많은 restaurant들을 가질 수 있기 때문에, category 쪽에서 one-to-many가 필요함

많은 category들이 하나의 restaurant을 가리킬 수 있음

restaurant category가 있고 그 안에 field type으로 category가 있음

category entity가 있는데 field type으로 restaurant array가 있음

app.module에 가서 entity를 추가해야 함

우버이츠에서 테스팅할 때 생긴 restaurant table이 보임

pgAdmin에서 (오래된)restaurant table을 삭제함

터미널에 npm run start:dev 입력하고, pgAdmin에서 restaurant table과 category table이 생성된 것을 확인

category가 지워졌을 때 실행되는 코드를 고쳐야 함

## 10.1 Relationships and InputTypes

category를 지울 때 restaurant은 지우면 안 된다는 점을 고려해야 함

graphql의 category field를 nullable: true라고 정의함

category를 지울 때 restaurant을 지우면 안 되기 때문임

restaurant는 category를 가질 수 있고 만약에 category가 지워지면 restaurant는 category를 가지지 않게 됨

category가 없는 restaurant를 생성하는 것도 가능함

owner를 nullable로 설정하지 않음

모든 restaurant에는 owner가 있기 때문임

owner를 지우면 restaurant도 같이 지워져야 함

restaurant에 category가 있을 수도 없을 수도 있음

restaurant은 항상 user(owner)가 있어야 함

owner는 restaurant을 여러 개 가질 수도 있음

schema에 있는건 모두 unique 해야함

모든 type은 딱 한 번 정의되어 있음

object type인 category type을 만들고 있음

input type도 만들고 있음

restaurant에도 다른 category field가 있기 때문에 문제가 생김

InputType은 name과 options를 받을 수 있음

entities에 name을 가지도록 만듦

abstract 타입이기 때문에 schema에 보여지지는 않음

컴퓨터가 다르게 인식함

에러가 난건 ObjectType과 InputType이 같은 name을 사용하고 있었기 때문임

데이터베이스를 위한 category와 InputType의 category가 다름

input type에서 restaurants 필드를 제거함(필요하지 않기 때문)

category를 만들 때, 아무도 category를 만들지 않을 수도 있고 운영자만 만들 수도 있음

graphql과 데이터베이스 모두가 인식할 수 있는 user가 됨

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Category {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  coverImg: String!
  restaurants: [Restaurant!]
}

input CategoryInputType {
  name: String!
  coverImg: String!
  restaurants: [RestaurantInputType!]
}

type Restaurant {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  coverImg: String!
  address: String!
  category: Category
  owner: User!
}

input RestaurantInputType {
  name: String!
  coverImg: String!
  address: String = "송파"
  category: CategoryInputType
  owner: UserInputType!
}

type User {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  email: String!
  password: String!
  role: UserRole!
  verified: Boolean!
  restaurants: [Restaurant!]!
}

input UserInputType {
  email: String!
  password: String!
  role: UserRole!
  verified: Boolean!
  restaurants: [RestaurantInputType!]!
}
```

볼 수 있음

## 10.2 createRestaurant part One

category가 있는 restaurant을 못 만들게 해야함

문제는 user를 가지고 있는 restaurant을 생성할 수 있다는 점임

user를 createRestaurantInput에서 제외시켜야 함

restaurant의 owner를 설정할 수 없게 하고 싶기 때문임

restaurant의 owner를 로그인한 유저한테서 받음

restaurant의 owner는 로그인한 유저가 됨

User인 owner가 restaurant service를 만들 때 필요함

graphql을 이용해서 owner가 있는 restaurant을 만들게 하고 싶지 않음

owner는 authorization 모듈에서 가져옴

user를 포함하는 restaurant을 생성할거고 category 이름이나 category id를 보내서 사용할 수 있어야 함

category를 get하고, create하고, update할 수 있어야 함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
  editProfile(input: EditProfileInput!): EditProfileOutput!
  verifyEmail(input: VerifyEmailInput!): VerifyEmailOutput!
  createRestaurant(input: CreateRestaurantInput!): CreateRestaurantOutput!
}

input CreateRestaurantInput {
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  coverImg: String!
  address: String = "송파"
}

type CreateRestaurantOutput {
  error: String
  ok: Boolean!
}
```

볼 수 있음

## 10.3 createRestaurant part Two

newRestaurant에서 .create를 부르면 restaurant의 instance를 생성하지만 데이터베이스에는 저장하지 않음

restaurant은 category를 항상 가져야함

category가 존재하지 않으면 그 category를 새로 만들고 싶고, 존재한다면 그 category를 get하고 싶음

category를 찾을 때 어떻게 찾을건지에 대한 기준이 필요함

restaurant owner가 자신의 category를 만들 수 있거나 리스트에서 하나를 고를 수 있음

categoryName에 slug를 만들어주고 싶음

name과 slug를 format함

get하는 name들이 소문자로 변환됐고 앞뒤에 빈 칸이 없음

category를 찾거나 category를 만듦

category repository를 만듦

category model에서 slug를 추가함

user가 category를 만들 때 이미지를 안 넣을 수도 있음

이미지는 admin이랑 관련됨

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 restaurant owner 계정을 만들고 token으로 로그인 함(restClient.http 파일에서 진행함)

restClient.http 파일에서 createRestaurant을 mutation하면 category record와 restaurant record가 생성됨

route, resolver에 보안이 안 되어 있어, 모든 사람이 restaurant을 만들 수 있음

delivery man이나 일반 user는 restaurant을 생성할 수 없어야 함

## 10.4 Roles part One

role based authentication을 만듦

createRestaurant에서 user가 owner일 경우에만 restaurant을 생성할 수 있고, user가 owner이거나 배달원일때만 order를 확인할 수 있음

배달원은 주문 내역만 보면 됨

resolver가 guard에 의해 보호 받고 있지 않음

@SetMetaData라는 decorator를 사용함

class 혹은 function에 넣은 key를 이용해 metadata를 assign하는 decorator임

metadata가 Reflector class를 이용해 반영될 수 있음

metadata에 접근할 수 있음

metadata를 설정함

터미널에 npm run start:dev 입력

pgAdmin에서 user record를 삭제하면 restaurant record도 삭제됨

## 10.5 Roles part Two

auth guard는 execution context를 가져올 뿐만 아니라 metadata도 가져옴

auth.module에서 APP_GUARD라는걸 제공함

APP_GUARD는 이미 nestjs에서 제공된 constant임

guard를 앱 모든 곳에서 사용하고 싶다면 APP_GUARD를 provide하면 됨

graphql context에서 user를 찾지 못 하면 false를 리턴함

로그인 되어 있지 않기 때문에 user를 만들 수 없음

auth guard가 어디에서든, 모든 request에 잘 작동함

authorization guard가 모든 곳에서 작동하도록 만듦

nest는 모든 resolver를 실행하기 전에 authGuard를 실행함

authorization guard를 살펴봐야 함

metadata가 설정되어 있으면, user의 role을 확인해야 함(authentication을 고려함)

metadata가 설정되어 있지 않으면, user authentication을 신경쓰지 않는다는 뜻임(role을 고려하지 않음)

user의 로그인 여부에 대해서 관심이 없음

resolver가 login이나 createAccount처럼 public이라는 뜻임(모든 사람이 사용 가능함)

모든 user는 자신의 profile을 볼 수 있음

userProfile에서도 자신의 프로필을 접근할 수 있음

user가 authenticated 되기를 원하고 그 후에 user의 role을 확인 해야함

createAccount는 public이고 login은 public이고 me는 anybody여야 하고 profile은 anybody여야 함

see profile은 아무나 자신의 프로필을 볼 수 있어야 하고, edit profile은 아무나 자신의 프로필을 수정할 수 있음

verifyEmail은 public임

createRestaurant은 owner들만이 restaurant을 만들 수 있음

authorization guard에 metadata를 넣어야함

metadata를 get하기 위해서 reflector class를 get 해야함

role이 undefined이면 resolver에 어떤 metadata도 설정하지 않았기 때문임

roles가 undefined라는건 public endpoint라는 것임

resolver에 metadata가 없으면 resolver가 public resolver라는 뜻임

auth guard가 true를 리턴하면 request는 진행이 허용되고, false를 리턴하면 진행될 수 없음

resolver에 metadata가 없으면 true를 리턴할거고, metadata가 resolver에 있으면 graphql의 ExecutionContext에서 user를 확인함

resolver에 metadata가 설정되어 있는데 user가 없으면 false를 리턴함

resolver에 metadata를 설정했다는건 user가 있기를 원함

role은 client, owner, delivery 중 하나임

metadata가 있으면 user가 있음

resolver는 어떤 user든 진행할 수 있도록 허용함

## 10.6 Roles Recap

guard가 작동하는지 확인함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 createAccount를 mutation하고 login을 mutation함(restClient.http 파일에서 진행함)

로그인 되어있지 않으면 me를 볼 수 없음

me를 query함

role과 상관없이 자신의 profile을 확인할 수 있음

userProfile을 query함

createRestaurant을 mutation함

pgAdmin에서 restaurant record가 생성된 것을 확인함

pgAdmin에서 생성된 user record의 role을 client로 변경함

createRestaurant을 mutation하면 Forbidden resource 에러가 나옴

pgAdmin에서 생성된 user record의 role을 owner로 다시 변경함

role based authentication과 authorization이 작동함

metadata와 global guard를 이용함

guard들은 APP_GUARD nestjs가 전체적으로 적용시킴

guard는 reflector를 사용함

reflector는 metadata를 get함

role decorator는 metadata를 설정함

metadata는 resolver의 extra data임

몇몇 resolver는 metadata를 가질거고 이 중 몇 개는 role이라는 key에 있음

decorator를 리턴하는 decorator를 만듦

role을 전달할 수 있도록 허용해줌

roles 배열이 roles metadata key에 저장됨

resolver에 metadata나 role이 없으면 public이니까 canActivate는 true임

me의 경우에는 role이 있으니 public이 아님

userProfile도 role이 있으니 public이 아님

role에 option은 client, owner, delivery, any임

UserRole은 enum임

metadata를 key, value로 저장함

브라우저, 자바스크립트의 localStorage도 key, value로 저장함

key, value로 metadata를 set하고 metadata를 key와 함께 가져옴

metadata를 가질 경우 계속해서 user를 graphqlContext에서 가져옴

resolver에 metadata가 있다면 유저가 로그인했다는 것임

graphqlContext에 유저가 없다면 유저에게 valid token이 없거나 token을 아예 보내지도 않았다는 것임

metadata도 있고 로그인된 유저도 있고 roles에 any도 있으면 모든 사람이 접근 가능함

resolver에 metadata가 있지만 유저가 로그인 되어있지 않으면 canActivate는 false임

## 10.7 Edit Restaurant part One

category를 클릭하면 category의 restaurant을 볼 수 있을거고 pagination과 함께 볼 수 있음

모든 restaurant을 front page에서 볼 수 있음

클릭하면 한 restaurant을 볼 수 있음

owner는 restaurant을 수정, 삭제할 수 있음

role based authentication을 이용함

owner가 dish를 만들고, 수정하고, 지울 수 있음

dish는 가격, 이미지, 세부사항, 용량이 있음

restaurant은 owner를 제외하고 모든 걸 수정할 수 있음

partial type은 class의 모든 property를 가져와서 optional 취급하고 그 다음에 pickType이 됨

pickType으로 원하는 class property를 가져옴

owner만이 restaurant을 수정할 수 있음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
  editProfile(input: EditProfileInput!): EditProfileOutput!
  verifyEmail(input: VerifyEmailInput!): VerifyEmailOutput!
  createRestaurant(input: CreateRestaurantInput!): CreateRestaurantOutput!
  editRestaurant(input: EditRestaurantInput!): EditRestaurantOutput!
}

input EditRestaurantInput {
  name: String
  coverImg: String
  address: String = "송파"
  categoryName: String
}

type EditRestaurantOutput {
  error: String
  ok: Boolean!
}
```

볼 수 있음

editRestaurantInput은 createRestaurantInput과 같지만 required가 아님

partialType을 사용하고 있기 때문에 property들을 optional로 해줌

editRestaurant도 category를 바꿀 수 있음

## 10.8 Edit Restaurant part Two

어떤 restaurant를 edit할지 모름

모든게 optional이고 restaurant id가 없음

edit-restaurant.dto.ts에서 graphql schema의 restaurantId type을 Int로 수정

```javascript
@Field(() => Int)
restaurantId: number;
```

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
input EditRestaurantInput {
  name: String
  coverImg: String
  address: String = "송파"
  categoryName: String
  restaurantId: Int!
}
```

볼 수 있음

레스토랑을 수정하고 싶어하는 사람이 owner인지 확인해야함

레스토랑을 찾고 수정해야함

레스토랑 owner와 레스토랑의 owner id가 같아야함

owner가 authorized된 사람인지 확인해야함

레스토랑 entity는 owner를 default로 가지고 있지 않음

RelationId는 entity를 받음

처음에 에러를 핸들해주고 이후에 하고 싶은 걸 하는게 defensive programming임

editRestaurantInput이 partial type이기 때문에 category가 없을 수도 있음

## 10.9 Edit Restaurant part Three

name을 이용해서 category를 get하거나 create함

custom repository를 하는 것에는 repository class를 extend하는 방법, abstract repository class를 extend하는 방법, entity repository를 만들고 constructor 등등을 가지는 방법이 있음

repository는 모든 method를 접근 가능하게 해줌

abstract repository는 public method를 원하는지 아닌지에 달렸음

repository를 entity에서 가져오지 말고 custom repository를 가져오고 싶음

repository를 생성할때마다 service의 type을 바꿔줘야하고, inject될 수 있게 repository를 로드해줘야함

editRestaurantInput에 category name이 있는지 확인함

editrestaurantinput.categoryname이 존재하면 category를 가져와야함

this.restaurants.create는 entity instance를 생성해줌

save의 definition을 보면 entity배열을 가지기 때문에 업데이트하고 싶을 때는 배열을 넣어줘야함

editRestuarantInput는 entity가 가지지 않은 것도 가지고 있음

object를 저장하려고 하는데 오브젝트의 column이 없음

editRestuarantInput를 categoryName없이 보내면 카테고리를 업데이트하고 싶지 않다는 뜻임

category를 object에 optional하게 넣어줌

category가 존재하면 category가 category인 object를 리턴함

점 3개를 추가해주면 {}가 지워짐

category가 null일 수도 있으니까 null이면 오브젝트에 포함하고 싶지 않음(null로 restaurant을 업데이트하고 싶지 않기 때문임)

## 10.10 Edit Restaurant Testing

테스트를 하기 위해서 로그인 함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 login을 mutation함(restClient.http 파일에서 진행함)

login을 하지 않은 상태로 editRestaurant mutation을 테스트 해봄

forbidden resource가 나옴

token을 넣고 pgAdmin에서 user record의 owner를 client로 수정하고 editRestaurant mutation을 테스트 해봄

forbidden resource가 나옴

pgAdmin의 user record의 role을 다시 owner로 수정하고 editRestaurant mutation을 테스트 해봄

pgAdmin의 restaurant record가 어떻게 바뀌었는지 확인함

category record가 생성됨

save에서 id를 보내지 않는 경우 새로운 entity를 생성함

id를 보내줘야 typeorm이 해당 entity를 찾아 update해줌

categoryName을 없애고 editRestaurant mutation을 해봄

name을 mexican house로 수정하고 editRestaurant mutation을 테스트 해봄

restaurant record가 어떻게 바뀌었는지 확인함

## 10.11 Delete Restaurant

delete restaurant을 해봄

delete-restaurant.dto.ts에서 graphql schema의 restaurantId type을 Int로 수정

```javascript
@Field(() => Int)
restaurantId: number;
```

deleteRestaurantInput.restaurantId로 restaurant을 찾고 있음

restaurant이 존재하지 않는다면 'Restaurant not found'를 보여줌

owner의 id가 restaurant의 ownerId와 같지 않다면 해당 레스토랑을 delete할 수 없다고 보여줌

조건들 모두 해당하지 않는다면 restaurant을 delete함

object에서 property가 없는 경우 undefined 값을 가져오는 경우가 있음

## 10.12 Categories part One

2개의 resolver를 만들건데 하나는 모든 category들을 보는거고, 다른 하나는 slug를 가지고 검색하여 category에 해당하는 restaurant들을 봄

output의 type은 ObjectType이어야함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  me: User!
  userProfile(userId: Int!): UserProfileOutput!
  allCategories: AllCategoriesOutput!
}

type AllCategoriesOutput {
  error: String
  ok: Boolean!
  categories: [Category!]
}

type Category {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  coverImg: String
  slug: String!
  restaurants: [Restaurant!]
  restaurantCount: Int!
}
```

볼 수 있음

allCategories를 query함(restClient.http 파일에서 진행함)

dynamic field는 db에 실제로 저장되지 않는 field임

request가 있을 때마다 계산해서(computed) 보여주는 field임

보통 computed field, dynamic field는 로그인된 사용자의 상태에 따라 계산되는 field임

category에 해당하는 restaurant이 몇 개인지 보여주는 field를 만듦

restaurantCount를 했을 때 해당 정보를 볼 수 있도록 만듦

해당 category가 가진 restaurant의 개수를 보여줌

dynamic field는 db와 entity에 존재하지 않음

entity에 restaurantCount를 선언하지 않고 request를 보낼 때마다 직접 계산해서 보여줌

ResolveField는 매 request마다 계산된 field를 만듦

restaurantCount는 function이고 number를 return함

restaurantCount라는 dynamic field를 만들었고 number인 80을 return함

allCategories를 query하여 결과를 확인함

type Category에 restaurantCount가 있고, 응답을 받을 때 계산되서 받음

request를 보내면서 field를 만듦

db, entity에 저장되는 field가 아니고, resolver에서 계산되는 field니까 유연성이 좋음

## 10.13 Categories part Two

restaurantCount는 field이고 restaurantCount의 parent는 Category임

service가 db를 감시하고 필요한 repository를 가지고 있음

coutRestaurant으로 보낸 category에 해당하는 restaurant을 셈

await를 쓰지 않았는데 promise를 return 하면 브라우저가 알아서 결과가 나올 때까지 기다림

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 allCategories를 query함(restClient.http 파일에서 진행함)

korean bbq를 category 이름으로 해서 restaurant을 만듦(createRestaurant을 mutation함)

allCategories를 query하여 restaurantCount의 결과를 확인함

parent에 접근할 수 있고, 개수를 셀 수 있음

유저가 홈화면에 들어오면 몇 개의 category가 있고, category에 해당하는 restaurant이 몇 개인지도 보여줄 수 있음

## 10.14 Category

category에 해당하는 restaurant들을 찾음

CoreOutput에는 항상 그렇듯이 ok와 error가 있음

ArgsType이 있고 아니면 InputType으로 만들어도 됨

categoryInput은 slug 하나만 가지고 있음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 category를 query함(restClient.http 파일에서 진행함)

db에서 어떤걸 load할 때 같이 load 하고싶은 relation도 명시해줘야함

category를 query하여 restaurants의 결과를 확인함

## 10.15 Pagination

pagination을 구현함

api에 page 1, 2.. 등을 요청하면 해당 page를 결과로 받음

CoreOutput으로 extends하면 ok, error, totalPages, category를 쓸 수 있음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  me: User!
  userProfile(userId: Int!): UserProfileOutput!
  allCategories: AllCategoriesOutput!
  category(input: CategoryInput!): CategoryOutput!
}

input CategoryInput {
  page: Int = 1
  slug: String!
}

type CategoryOutput {
  error: String
  ok: Boolean!
  totalPages: Int
  category: Category
}
```

볼 수 있음

어떤 코드가 무슨 기능을 하는지 기억이 안 날 때는 그 부분을 지워보고 뭐가 작동되지 않는지 확인을 해서 쉽게 알아낼 수 있음

CategoryOutput에 error, ok, totalPages, category 모두 있음

category에는 retaurants, restaurantCount가 있음

CategoryInput에는 page에 default값이 있고 slug도 있음

category를 query함(restClient.http 파일에서 진행함)

service에서의 문제는 relations에서 restaurants를 load한다는 것임

pagination을 써서 retaurants를 부분적으로 load함

25개의 restaurants을 받아오면 웹사이트를 들어갔을 때 25개의 restaurants를 보여줌

page 2인 경우에는 다음으로 나올 25개의 restaurants를 보여줌

처음에 나온 25개의 restaurants는 건너뛰어야 된다는 것임

26~50번 restaurants을 받음

알아서 pagination을 만들어주는 package도 있음

category를 query한 totalPages 결과를 확인함

totalPages는 totalResults를 25로 나눈 값임

Math.ceil()을 사용해서 totalPages를 정수로 만들어줌

pagination을 다루는 nestjs package가 있음

package를 설치해서 쓰는 것보다 대부분 직접 구현함

## 10.16 Restaurants

see restaurants(여러 개의 restaurant) resolver를 작업함

query에 error, totalPages, category, restaurants가 있음

restaurants는 category 밖으로 옮김

한 page의 크기는 25로 함

findAndCount는 array를 return함

find를 하고 count까지 return해줌

Restaurant의 array와 number를 return 받음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  me: User!
  userProfile(userId: Int!): UserProfileOutput!
  restaurants(input: RestaurantsInput!): RestaurantsOutput!
  allCategories: AllCategoriesOutput!
  category(input: CategoryInput!): CategoryOutput!
}

input CategoryInput {
  page: Int = 1
  slug: String!
}

type CategoryOutput {
  error: String
  ok: Boolean!
  totalPages: Int
  totalResults: Int
  restaurants: [Restaurant!]
  category: Category
}

input RestaurantsInput {
  page: Int = 1
}

type RestaurantsOutput {
  error: String
  ok: Boolean!
  totalPages: Int
  totalResults: Int
  results: [Restaurant!]
}
```

볼 수 있음

createRestaurant을 mutation하고 category를 query함(restClient.http 파일에서 진행함)

restaurants를 query한 results를 확인함

## 10.17 Restaurant and Search

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Query {
  me: User!
  userProfile(userId: Int!): UserProfileOutput!
  restaurants(input: RestaurantsInput!): RestaurantsOutput!
  restaurant(input: RestaurantInput!): RestaurantOutput!
  searchRestaurant(input: SearchRestaurantInput!): SearchRestaurantOutput!
  allCategories: AllCategoriesOutput!
  category(input: CategoryInput!): CategoryOutput!
}

input RestaurantInput {
  restaurantId: Int!
}

type RestaurantOutput {
  error: String
  ok: Boolean!
  restaurant: Restaurant
}

input SearchRestaurantInput {
  page: Int = 1
  query: String!
}

type SearchRestaurantOutput {
  error: String
  ok: Boolean!
  totalPages: Int
  totalResults: Int
  restaurants: [Restaurant!]
}
```

볼 수 있음

restaurant을 query함(restClient.http 파일에서 진행함)

restaurant을 검색했을 때 여러 개의 restaurant이 나올 수도 있음

restaurant을 search할 때 findAndCount를 사용함

LIKE는 다음에 나오는 value를 찾아줌

LIKE '200%'라 하면 '200'으로 시작하는 값을 찾아줌

LIKE '%200%'라 하면 어떤 곳에라도 '200'이 포함된 값을 찾아줌

_를 써서 LIKE '_00%'라 하면 두번째, 세번째 자리에 '0'이 들어간 값을 찾아줌

'%2'는 '2'로 끝나는 값을 찾아줌

'2___3'는 2로 시작하고 3으로 끝나는 다섯자리 숫자를 찾아줌

## 10.18 Search part Two

pagination을 적용함

name으로 restaurant을 검색함

findAndCount를 하면서 skip, take를 씀

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 searchRestaurant을 query함(restClient.http 파일에서 진행함)

"bbq"를 검색해도 나오지 않는 이유는 소문자인 "bbq"가 없기 때문임

"BBQ"처럼 대문자로 하면 잘 작동함

ILike에서 I는 'Insensitive'를 뜻하고, 대문자라든지 소문자라든지 case에 상관하지 않음

typeorm git repository에서 pull request를 보면 ILike를 사용할 수는 있는데, 아직 npm package로 나오지 않은 것 같음

모든 orm은 sql을 이용해서 db에 직접 접근할 수 있게 해줌

sql을 이용해서 name을 직접 검색해봄

typeorm에는 Raw() 라는게 있고, 이게 raw query를 실행할 수 있도록 해줌

Raw() 설명을 보면 value를 argument로 주면 된다고 나와 있음

ILIKE는 대문자, 소문자 상관 없이 검색함

orm을 이용하지 않고도 sql로 직접 db에 접근할 수 있음

## 11.0 Dish Entity

dish entity를 만듦

Restaurant은 많은 Dish를 가지게 될 거고, Dish는 한 개의 Restaurant을 가지게 됨

식당에 음식이 반드시 있어야 하니까 null을 허용하지 않음

Restaurant이 삭제가 된다면 거기에 있는 Dish들도 전부 삭제되어야함

Restaurant은 많은 Dish를 갖고, Dish는 하나의 Restaurant을 가짐

Restaurant는 menu를 가지고, menu는 Dish의 배열임

Dish는 restaurant field를 가지고 있고, restaurant은 Restaurant type임

터미널에 npm run start:dev 입력하고, dish table이 생성된 것을 확인

dish table은 id, createdAt, updatedAt, name, price, photo, description, restaurantID column을 가짐

Dish의 restaurant을 dish.restaurant 에서 찾을 수 있음

Dish에서는 dishes를 restaurant.menu에서 찾을 수 있음

## 11.1 Create Dish part One

json type은 기본적으로 json data를 저장함

json type을 사용하는 이유는 Dish option을 entity에 넣고 싶지 않기 때문임

dish는 많은 option을 가질 수 있고, option은 한 개의 dish를 가질 수 있음

구조화된 데이터를 저장하거나, 특정 형태를 가진 데이터를 저장해야 할 때 json type을 사용함

json은 MySQL, PostgreSQL에서 지원하는 data type임

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Dish {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  price: Int!
  photo: String
  description: String!
  restaurant: Restaurant!
  options: [DishOption!]
}

type DishOption {
  name: String!
  choices: [String!]
  extra: Int!
}

input DishOptionInputType {
  name: String!
  choices: [String!]
  extra: Int!
}

type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
  editProfile(input: EditProfileInput!): EditProfileOutput!
  verifyEmail(input: VerifyEmailInput!): VerifyEmailOutput!
  createRestaurant(input: CreateRestaurantInput!): CreateRestaurantOutput!
  editRestaurant(input: EditRestaurantInput!): EditRestaurantOutput!
  deleteRestaurant(input: DeleteRestaurantInput!): DeleteRestaurantOutput!
  createDish(input: CreateDishInput!): CreateDishOutput!
}

input CreateDishInput {
  name: String!
  price: Int!
  description: String!
  options: [DishOptionInputType!]
  restaurantId: Int!
}

type CreateDishOutput {
  error: String
  ok: Boolean!
}
```

볼 수 있음

restaurant 없이는 dish를 만들 수 없음

restaurants를 get하는 방식을 수정함

restaurant을 id로 찾을 때 restaurant의 dish를 load해줘야함

restaurant에 가서 세부사항을 볼 때, menu를 불러올 수 있음

모든 dishes를 불러올 수 있음

dish를 추가하려고 하면, 어떤 restaurant에 추가할지 알아야함

CreateDishInput을 PickType으로 extends 하고 restaurantId를 가지고 있음

PickType으로 Dish에서 property를 고름

어떤 restaurant에 dish를 추가하는지 모르면 dish를 추가할 수 없음

소유하지 않은 restaurant에는 dish를 추가할 수 없음

오직 owner만 createDish Resolver에 접근할 수 있음

createDish는 owner가 필요함

## 11.2 Create Dish part Two

create dish service안에 createDish의 method를 만듦

첫번째로 restaurant을 찾아야함

그 다음 owner와 restaurant의 owner가 같은지 확인해야함

그 다음 dish를 생성하고 restaurant에 dish를 추가해줌

createDishInput은 name, price, description, options로 이루어져 있음

createDishInput은 restaurantId가 포함되어있음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 createDish를 mutation함(restClient.http 파일에서 진행함)

pgAdmin에서 dish record가 생성된 것을 확인함

restaurant은 Resolver에 있는 restaurantId를 통해서 찾음

restaurant을 query함

object를 create하고, save해야함

## 11.3 Edit and Delete Dish

Dish를 delete하고 edit하는걸 만듦

PartialType(Dish) object를 쓰고, 모든 Dish의 property가 선택적임

Onwer만 Dish를 수정할 수 있음

dish를 delete 요청한 사람이 그 restaurant의 owner인지 확인해줘야함

dish.restaurant.ownerId와 owner.id가 같지 않은 경우를 찾으면 됨

restaurant.ownerId를 가져와야 하기 때문에 relations이 필요함

relations restaurant을 load시켜줘야함

dishId에 해당하는 dish를 지움

catch는 발견하는 모든 error를 잡아줌

checkDish function은 dish가 존재하는지 검사하고, owner가 restaurant의 owner와 같은지를 검사함

dishId없이는 dish를 수정할 수 없음

save는 id를 넘겨주면 entity를 update 해줌

object를 구성하기만 하면 save가 update를 해줌

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 deleteDish를 mutation함(restClient.http 파일에서 진행함)

createDish를 mutation하여 pgAdmin에서 dish record가 생성된 것을 확인함

choices가 주문의 값을 변경할 수도 있음

editDish를 mutation하여 pgAdmin에서 dish record가 변경된 것을 확인함

## 11.4 Order Entity

터미널에 nest g mo orders 입력

nest generate module orders라는 의미임

app module에 자동으로 추가를 해줌

order는 relationship이 있건 없건 restaurant을 가지고 있음

주문을 하면, 주문은 Pending(대기) 상태임

주문을 받으면 Cooking(조리)를 시작함

그 다음 음식이 PickedUp(픽업) 될거고, 음식이 Delivered(배달완료) 됨

주문을 하면, 그 주문은 배정된 driver가 없음

주문을 했을 때 바로 배달해 주는 사람이 존재하지 않음

한 명의 유저는 많은 주문을 가질 수 있음

많은 order는 한 명의 user를 가짐

user를 지운다고 해도, order를 지우지 않음

driver가 받은 orders를 찾는 대신, 구분하기 위해서 rides라고 함

고객이 주문을 하면 order는 user.orders에 보임

driver가 주문을 픽업하면 그 order는 user.rides에 나타남

customer를 삭제한다고 해도 order는 안 지워짐

driver를 지워도 order가 지워지지 않음

한 개의 restaurant은 여러 개의 orders를 가짐

많은 사람들이 같은 음식을 주문할 수 있으니까 하나의 dish는 여러 order를 가질 수 있음

order는 여러 dish를 가질 수 있고, dish도 여러 order를 가질 수 있음

many to many의 의미는 "A는 B의 여러 인스턴스를 포함하며, B는 A의 여러 인스턴스를 포함한다."임

JoinTable은 소유(owning)하고 있는 쪽의 relation에 추가해주면 됨

dish가 어떤 order에 포함되는지 알 수 없음

order는 어떤 dish를 고객이 선택했는지 알 수 있음

dish가 얼마나 많은 order를 받았는지 알 필요가 없음

order로부터 몇 개의 dish를 주문했는지는 알아야함(음식을 여러 개 주문할 수 있기 때문임)

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Order {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  customer: User
  driver: User
  restaurant: Restaurant!
  dishes: [Dish!]!
  total: Float!
  status: OrderStatus!
}

enum OrderStatus {
  Pending
  Cooking
  PickedUp
  Delivered
}

type Restaurant {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  coverImg: String!
  address: String!
  category: Category
  owner: User!
  orders: [Order!]!
  menu: [Dish!]!
}

type User {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  email: String!
  password: String!
  role: UserRole!
  verified: Boolean!
  restaurants: [Restaurant!]!
  orders: [Order!]!
  rides: [Order!]!
}
```

볼 수 있음

## 11.5 Create Order part One

entity를 InjectRepository해주고, type을 추가해줌

Order는 customer가 필요한데, token에서 받아올거라 필요없고 driver도 필요없음

Order는 restaurant의 id를 받으면되고, dishes 배열도 필요함

total은 처음에는 필요 없음

status는 직접 default 값을 지정함

customer가 누구인지 알아야 하니까 AuthUser가 필요함

dishes의 모든 것을 다 가져올 필요가 없음

order를 만들 때 dishes의 name과 price만 필요하고 다른 정보는 필요 없음

order를 만들어주는 resolver를 셋업함

Client만 order를 만들 수 있음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
  editProfile(input: EditProfileInput!): EditProfileOutput!
  verifyEmail(input: VerifyEmailInput!): VerifyEmailOutput!
  createRestaurant(input: CreateRestaurantInput!): CreateRestaurantOutput!
  editRestaurant(input: EditRestaurantInput!): EditRestaurantOutput!
  deleteRestaurant(input: DeleteRestaurantInput!): DeleteRestaurantOutput!
  createDish(input: CreateDishInput!): CreateDishOutput!
  editDish(input: EditDishInput!): EditDishOutput!
  deleteDish(input: DeleteDishInput!): DeleteDishOutput!
  createOrder(input: CreateOrderInput!): CreateOrderOutput!
}

input CreateOrderInput {
  dishes: [DishInputType!]!
  restaurantId: Int!
}

input DishInputType {
  name: String!
  price: Int!
  photo: String
  description: String!
  restaurant: RestaurantInputType!
  options: [DishOptionInputType!]
}

type CreateOrderOutput {
  error: String
  ok: Boolean!
}
```

볼 수 있음

## 11.6 Order Items

실제로 저장해야할 것은 Dish array가 아님

user가 원하는 dish랑, user가 choice한 property를 저장해야함

OrderItem은 Dish가 있어야 하고, 선택된 options도 있어야함

options는 entity가 아니고 json임

음식을 주문할 때 이 음식의 옵션은 단순히 text여야함

owner가 옵션을 수정할 수도 있기 때문에 customer는 옵션을 관리 할 수 없음

options는 order가 생성되고 완료 될 때 한번 저장됨

나중에 owner가 음식의 옵션을 수정해도 문제 없음

OrderItem은 1개의 dish를 가짐

dish는 여러 item을 가짐

order entity에서는 Restaurant에서 orders를 어떻게 가져올지 신경써야함

Dish에서 어떻게 OrderItem을 가져올지 신경쓰지 않아도 됨

주문한 식당이 있고, 그 식당에서 주문에 접근하길 원함

Dish쪽에서 OrderItem에 접근하기를 원하지 않음

OrderItem에서 Dish로 접근하기만을 원함

Order는 많은 OrderItem을 가지게 됨

OrderItem은 dish와 options를 가지고 있음

PickType은 model에서 property를 고름

Order를 만들때 Dish의 id랑 options만 전송하고 싶음

음식의 이름이나 가격은 신경쓰고 싶지 않음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하면 playground가 실행되고 schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
  editProfile(input: EditProfileInput!): EditProfileOutput!
  verifyEmail(input: VerifyEmailInput!): VerifyEmailOutput!
  createRestaurant(input: CreateRestaurantInput!): CreateRestaurantOutput!
  editRestaurant(input: EditRestaurantInput!): EditRestaurantOutput!
  deleteRestaurant(input: DeleteRestaurantInput!): DeleteRestaurantOutput!
  createDish(input: CreateDishInput!): CreateDishOutput!
  editDish(input: EditDishInput!): EditDishOutput!
  deleteDish(input: DeleteDishInput!): DeleteDishOutput!
  createOrder(input: CreateOrderInput!): CreateOrderOutput!
}

input CreateOrderInput {
  items: [OrderItemInputType!]!
  restaurantId: Int!
}

input OrderItemInputType {
  dish: DishInputType!
  options: [DishOptionInputType!]
}

input DishInputType {
  name: String!
  price: Int!
  photo: String
  description: String!
  restaurant: RestaurantInputType!
  options: [DishOptionInputType!]
}

type OrderItem {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  dish: Dish!
  options: [DishOption!]
}

type CreateOrderOutput {
  error: String
  ok: Boolean!
}
```

볼 수 있음

## 11.7 Create Order part Two

order를 만들 때, restaurant ID를 보내주기 원함

어떤 식당에 주문했는지와 주문한 음식이 뭔지를 알 수 있음

dish의 id만 얻고 싶음

orderItem에 options가 없을 수도 있음

OrderItem 전체를 input으로 하기 싫음(Dish에는 신경 쓸 필요 없는 것들이 많기 때문임)

OrderItemInput은 dishId가 있고, 유저가 선택한 맛 같은 것이 있는 options도 가지고 있음

options에는 name, choices, extra가 있음

user가 로그인을 했고, customer인 것을 알 수 있음

restaurant ID로 restaurant을 찾아야함

## 11.8 Create Order part Three

order를 먼저 만들고 item을 추가함

default는 Orderstatus.Pending으로 함

order에 customer를 넣어서 만들어줘야함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 createAccount를 mutation함(restClient.http 파일에서 진행함)

두 user가 있는데, 하나는 owner이고, 하나는 customer임

createOrder를 mutation하여 pgAdmin에서 order record가 생성된 것을 확인함

customer의 token으로 order를 만들 수 있음

order entity로 가보면 restaurant이 있고 이 restaurant은 null이 가능함

nullable이기 때문에 order를 만들 때 restaurant이 없어도 db 에러가 생기지 않음

items는 dishId와 options의 배열임

query restaurant을 하여 options를 확인함

options들은 단순히 json임

만약 options에서 실수를 하게 되어도, 그냥 json이라 relationship, null, delete, cascade를 걱정하지 않고 json을 자유롭게 생성할 수 있음

OrderItemOption은 user가 고른 한가지 선택만 갖게 됨

dish는 user가 고른 options도 필요하다는 것을 알게 됨

OrderItem을 만들어 options를 저장함

schema에서

```javascript
type Mutation {
  createAccount(input: CreateAccountInput!): CreateAccountOutput!
  login(input: LoginInput!): LoginOutput!
  editProfile(input: EditProfileInput!): EditProfileOutput!
  verifyEmail(input: VerifyEmailInput!): VerifyEmailOutput!
  createRestaurant(input: CreateRestaurantInput!): CreateRestaurantOutput!
  editRestaurant(input: EditRestaurantInput!): EditRestaurantOutput!
  deleteRestaurant(input: DeleteRestaurantInput!): DeleteRestaurantOutput!
  createDish(input: CreateDishInput!): CreateDishOutput!
  editDish(input: EditDishInput!): EditDishOutput!
  deleteDish(input: DeleteDishInput!): DeleteDishOutput!
  createOrder(input: CreateOrderInput!): CreateOrderOutput!
}

input CreateOrderInput {
  restaurantId: Int!
  items: [CreateOrderItemInput!]!
}

input CreateOrderItemInput {
  dishId: Int!
  options: [OrderItemOptionInputType!]
}

input OrderItemOptionInputType {
  name: String!
  choice: String
  extra: Int
}

type CreateOrderOutput {
  error: String
  ok: Boolean!
}
```

볼 수 있음

option은 name과 choices를 가짐

choice도 extra를 가질 수 있고, options도 extra를 가질 수 있음

input에 ID가 10인 restaurant에 주문하려는 items을 생성함

dish Id가 2라는 의미는 우리가 Super Mexican Taco Chicken을 주문했다는 거고, Super Mexican Taco Chicken이 가지고 있는 option은 Spice Level이고 choice는 kill me임

## 11.9 Create Order part Four

choice가 가지면 안되는 한 가지는 extra임

user에게 얼마 낼지 물어보는 것을 원하지 않기 때문임

얼마를 내야 하는지는 항상 back-end에서 계산하면 됨

DishOption에 name이랑 extra가 필요하지 않음

react와 GraphQL을 이용해서, request를 날리면 back-end에서는 extra가 얼마인지 찾아봄

json으로 작업했기 때문에 SQL과 TypeOrm이 체크해주지 않음

CreateOrderInput으로 받은 각 item을 OrderItem으로 만듦

OrderItem을 보면 dish가 필요하고, options가 필요함

dish를 못 찾으면, orderItem을 만드는 작업을 전부 취소해야함

input 내부의 items에 대해 dish를 찾음

db에서 가져온 dish와 options를 이용해서 orderItem을 생성함

## 11.10 Create Order part Five

forEach에서는 return 할 수 없음

items.forEach 대신에 for of 를 사용함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 createOrder를 mutation함(restClient.http 파일에서 진행함)

유저가 지불해야 하는 금액을 계산 해야함

item에는 options가 있고, dish에도 options가 있음

item의 options를 하나하나 살펴봄

item을 dish DB에서 찾고 싶음

options를 loop로 돌아서 name과 choice를 찾음

option과 choice에 extra 요금이 있는지 없는지 확인함

다음 option에서도 name을 찾고 choice가 없으니 extra를 추가함

dish.options는 DishOption의 배열이고 item.options는 OrderItemOption의 배열임

dish에서 property를 가져옴

db에서 가져온 dish에서 dish options를 찾아야함

백엔드에서 돈을 계산하고 싶음

itemOption에 extra가 필요없음

dishOption에 extra가 없으면, dishOption의 choices를 봐야함

## 11.11 Create Order part Six

찾은 모든 extra 가격들을 dish.price에 추가함

dishFinalPrice의 초기값은 dish.price임

extra를 찾을 때마다 dishFinalPrice에 추가함

orderFinalPrice가 모든 dish의 총 합계임

item의 옵션 계산이 끝나면, orderFinalPrice에 dishFinalPrice를 더함

json은 원하는 모든 것을 보내고 db에 저장할 수 있어서 자유롭지만, 세부 작업을 직접 처리해줘야 할 필요가 있음

relationship을 썼다면 옵션을 찾는 작업을 할 필요가 없음

주문은 옵션이 있음

orderItem이 order에 들어가기 때문에 orderItem을 만들 때마다, orderItem을 저장해야함

orderItems type은 OrderItem array임

orderItem을 만들 때마다, orderItem을 push함

dish와 option으로 모든 orderItem을 만들고, 만들어진 orderItem을 orderItem Array로 push함

orderItem을 보면 order ID와 orderItem이 있음

through table이라 부르는데 in between table임

ManyToMany 관계에서 씀

pgAdmin에서 order record를 지움

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 createOrder를 mutation함(restClient.http 파일에서 진행함)

pgAdmin에서 order record가 생성된 것을 확인함

주문 생성하는 것을 완료함

## 11.12 getOrders part One

주문 읽는 것을 함

기본적으로 ID로 주문을 찾아야함 

주문 목록을 받고 ID로 주문을 찾음

getOrders와 getOrder를 만듦

음식점 주인은 모든 주문을 보고 싶어함

고객은 자신이 주문한 것을 보고 싶어함

배달원은 자신이 배달한 모든 주문을 보고 싶어함

이 세 사람 모두 orders를 read 할 수 있고 order도 read 할 수 있어야함

모든 주문을 보거나 일부 주문만 볼 수도 있음

아무나, 누구든, 로그인 되어있는 누구나 getOrders에 접근할 수 있음

누가 요청 했는지 알아야함(만약 배달원이 요청하면 다른걸 검색해서 다른 종류의 주문을 보여줄거기 때문임)

유저, 그러니까 배고픈 사람이 getOrders를 하면, 그가 만든 모든 주문을 보여줘야함

customer 주문을 찾아봐야함

만약 배달원이 주문을 검색하면, 그가 배달원으로 등록된 주문을 검색하고 싶다는 뜻임

유저의 role을 가져와야함

user.role이 UserRole.Client와 같은 경우, user.role === UserRole.Delivery 일 때, user.role === UserRole.Owner 일 때에 뭘 할지 안에 작성함

status는 delivered가 될 수도 있고 status는 뭐든 될 수 있음

status를 기준으로 검색해야함

유저가 고객이면 주문을 찾아야하는데, where에 옵션으로 customer가 user인 경우를 찾으면 됨

restaurant에는 owner가 있고, owner는 많은 restaurant을 가질 수 있게 했음

owner가 user인 모든 Restaurants 을 찾고, relations을 load함(restaurant에 orders가 있기 때문임)

restaurant을 load하고 싶지 않고 orders만 load하면 됨

owner가 user인 모든 음식점을 찾고, orders를 select함

orders만 select해서 list의 형태로 받음

유저가 3개의 식당을 가지고 있고 각 식당이 2개의 order를 가지고 있다면, 3개의 요소를 가진 array를 받음

요소들은 그 안에 또 다른 array를 가짐

orders는 nullable로 해야함(종종 우리는 주문을 찾고. 그렇지 않은 경우도 있기 때문임)

restaurant들은 orders가 load되는데, 이 order들을 하나씩 꺼내서 리스트로 만들어줘야함

flat이 하는 일은 Array 내부에서 Array를 바깥으로 빼내는 것임

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 getOrders를 query함(restClient.http 파일에서 진행함)

owner가 user인 모든 restaurant을 load하고 orders relation도 load함

order를 원하는거고 order가 들어있는 array를 원하는게 아님

map을 써서 각 restaurant에서 orders를 가져옴

map은 restaurant.orders array를 하나씩 꺼내줌

모든 restaurant에 order가 있지는 않음

flat은 모든 하위 Array 요소와 함께 새 Array를 return함

내부 Array의 모든 요소를 ​외부로 가져옴

flat을 하면, depth는 default로 1이고 이건 1단계를 의미함

## 11.13 getOrders and getOrder

status에 따라 order를 filtering 해봄

두 명의 유저가 있는데 한 명은 customer이고 다른 한 명은 admin임

cutomer는 자기가 customer이고 input으로 준 status에 해당하는 restaurant을 받음

status가 undefined일 때 status를 보내면 안 됨

status를 보내지 않으면 TypeORM은 아무것도 보여주지 않음

object에 조건부로 property를 추가할 수 있음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 getOrders를 query함(restClient.http 파일에서 진행함)

어떠한 status도 보내지 않으면, 모든 order을 볼 수 있음

status가 있는 경우에 orders를 filtering 해야함

map은 새로운 배열을 생성하고, filter는 조건을 충족시키지 못하는 요소를 제거함

PickType으로 Order에서 필요한 id를 가져옴

order를 찾을 경우 Order를 return 해야함

getOrderInput은 기본적으로 id를 가지고 있음

orderId로 order를 찾음

order를 볼 수 있는 사람은 driver, customer, restaurant의 owner임

order.customer.id 가 user.id 와 같지 않고, order.driver.id 가 user.id 와 같지 않고, order.restaurant.ownerId 가 user.id 와 같지 않다면 ok : false, error:"you can't see that"를 return함

3개의 relation을 load 해야함

restaurant relation은 무조건 load 해야함(order의 restaurant owner를 꼭 알아야하기 때문임)

customer와 driver는 굳이 load 안 해도 됨

relation을 load하지 않고 id를 확인하고 싶다면 RelationId 컬럼을 만들기만 하면 됨

restaurant에 있는 owner가 필요하니까 restaurant은 load 해야함(restaurantId는 필요없음)

getOrder를 query함

pgAdmin에서 user의 role을 client에서 delivery로 변경함

user.role이 UserRole.Client 와 같으면서 order.customerId 가 user.id 와 같지 않으면, ok = false라고 함

pgAdmin에서 user의 role을 delivery에서 client로 다시 변경함

## 11.14 Edit Order

음식점 주인이나, 배달원이나, 배고픈 사람 그 누구도 주문을 삭제 할 수 없음

아무도 주문을 삭제할 수 없지만 그들은 주문을 업데이트 할 수는 있음

ID를 가지고 order를 찾고, 업데이트할 status도 보내야함

Order로부터 Order의 id와 status를 가져옴

둘 다 꼭 필요한 input임

status가 주문에서 수정할 수 있는 유일한 것임

유저가 배달원인지 ,식당의 주인인지, 고객인지 체크해야함

restaurant relation을 load하고 주문을 볼 수 있는지 확인하는 function을 만듦

order는 restaurant relation이 필요함

Delivery와 Owner만 order을 edit 할 수 있음

order는 Pending으로 client가 생성함

retaurant이 order를 받으면 order entity의 status가 Cooking이 됨

추가로 Cooked라는 status가 더 필요함

주문이 픽업을 기다리고 있는 상태임

Cooking과 Cooked는 음식점이 변경 할 수 있음

PickedUp과 Delivered는 배달원이 바꿀 수 있음

user.role이 UserRole.Owner인 경우를 체크함

role을 체크한 다음에 status를 체크함

order를 업데이트함

user의 role이 Owner이고 status가 Cooking이나 Cooked가 아니라면, status를 업데이트 하지 않음

user.role이 delivery이고 status가 pickedUp 혹은 delivered가 아니면, status를 업데이트 하지 않음

Delivery와 Owner만 주문을 수정할 수 있음

user.role === UserRole.Client라면 주문을 수정하지 못 하게 함

save는 entity를 save 해줌

유저가 Client면 수정 할 수 없음

유저가 Owner인데 status가 Cooking, Cooked가 아니면, 수정 할 수 없음

유저가 Delivery인데 status가 PickedUp, Delivered가 아니면, 수정 할 수 없음

## 12.0 Subscriptions part One

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 editOrder를 mutation함(restClient.http 파일에서 진행함)

Owner은 Cooking이나 Cooked로만 바꿀 수 있음

pgAdmin에서 user의 role을 owner에서 delivery로 변경함

pgAdmin에서 user의 role을 delivery에서 owner로 다시 변경함

driver는 주문 들어오는걸 기다리다가, 새로운 주문이 들어오면 driver가 주문을 받겠다고 함

드라이버가 주문을 받으면 주문에 드라이버를 포함시킴

운전자는 주문을 업데이트할 수 있음

드라이버는 주문을 픽업하는 사람이 됨

subscriptions는 resolver에서 변경 사항이나 업데이트를 수신 할 수 있게 해줌

Subscription은 asyncIterator라는 것을 return함

graphQL Subscription을 위해 사용할 패키지의 이름은 graphql-subscriptions임

graphQL에서 subscriptions를 쓸 수 있게 만들어줌

real time 처리를 할 수 있게 만들어줌

터미널에 npm i graphql-subscriptions@1.1.0 입력

PubSub은 publish and subscribe를 말함 

app 내부에서 메시지를 교환할 수 있음

PubSub engine 인스턴스를 생성함

triggers는 기다리는 이벤트를 말함

hotPotatos를 subscription함

서버는 HTTP 프로토콜에서 실행되고 있음

WS도 프로토콜이고 Real Time을 처리하는 Web Socket임

Web Socket을 활성화 해야함

HTTP와 WS 모두 서버가 돌아갈 수 있어야함

Mutation과 Query는 HTTP 가 필요하고, Subscription은 Web Socket이 필요함

app module에 InstallSubscriptionHandlers: true라고 적으면 서버가 웹 소켓을 기능을 가지게 됨

subscription을 연결하는 방법이 API를 연결하는 방법과 다름

Subscription에 연결하려는 순간, HTTP route를 거치지 않고 Web Socket route를 거치고 있음

웹 소켓에는 request가 없음

웹 소켓에 연결할 때는 쿠키를 보내고 받는 것이 없음

연결되면 연결 상태를 유지함

## 12.1 Subscriptions part Two

HTTP 요청은 잘 작동하고 있음

웹 소켓을 통해 연결하려고 하는 순간 에러가 발생함

user는 정의되지 않은 것으로 읽을 수 없음

웹 소켓을 쓰려고 하면, HTTP 프로토콜이 아닌 웹 소켓 프로토콜이 필요함

HTTP에는 request라는 것이 있음

웹 소켓에는 request가 없고, 대신에 connection이라는 것이 있음

Connection에는 query가 있고, variables도 있고, operationName 그리고 context가 있음

웹 소켓에 연결할 때에는 Request가 없고 Connection만 있음

웹 소켓은 HTTP와 연결 방법이 다름

HTTP에서는 매번 request할 때마다 토큰을 보냄

모든 Request때마다 같이 보냄

웹 소켓은, 딱 한 번만 토큰을 보냄 

연결을 시작할 때 토큰을 보내는데 연결이 끝나지는 않음

많은 이벤트를 받고 보낼 수 있으며, 토큰을 다시 보낼 필요가 없음

누가 subscription을 listening하는지 인증하고 알아야함

특정 사람들만 주문의 업데이트를 listening 할 수 있게 함

connection은 context와 같이 옴

request에 x-jwt context는 없음

request는 x-jwt header가 있음

potatoReady는 asyncIterator(hotPotatos)를 발생시키는 작업을 해야함

potatoReady에서 pubsub.publish()를 함

이벤트에 트리거를 publish함

hotPotatos를 publish함

payload는 object여야함

트리거 이름은 pubsub.publish()과 pubsub.asyncIterator()에서 같으면 됨

트리거의 이름은 같아야만 함

publish의 payload에는 object의 key로 method function을 넣으면 됨

트리거의 이름과 publish하는 이름은 같아야함

hotPotatos 두 개는 트리거고, publish의 payload는 객체여야함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 readyPotato를 subscription하고, potatoReady를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

어떤 유저가 listening하는지 알아야하니까 user가 필요함

주문 업데이트를 listening하길 원함

누군가 주문을 업데이트했을 때, 주문 업데이트를 publish함

지금은 아무나 listening 할 수 있음

## 12.2 Subscription Authentication part One

resolver를 보호하기 위해 Role decorator를 씀

Role decorator에서 메타 데이터를 설정하면, Authorization guard가 입력된 role에 맞게 처리를 함

@AuthUser() user: User라 하면, 현재 로그인한 유저를 알려줌

토큰은 HTTP header에서 옴

웹 소켓은 HTTP가 아님

인증은 jwt middleware에 의해 처리됨

jwt middleware는 request, response, next를 처리함

토큰을 찾고, 디코딩하고, 유저를 찾아서 request에 user를 넣음

jwt middleware가 웹 소켓과 관련된 일은 처리하지 않음

웹 소켓에는 req, res, next 모두 없음

누가 subscription을 listening하는지 알아야함

더 이상 쓸 수 없는 jwt middleware를 삭제함

jwt token 을 없앰

guard가 resolver에 접근 할 수 없다고 알려줌

guard가 웹 소켓과 HTTP를 위해서 호출됨

guard는 HTTP이든 웹 소켓이든 모든 graphQL resolver에 대해 호출됨

guard는 auth.guard에 있음

guard에는 context가 있음

헤더에는 x-jwt가 있음

x-jwt를 Authorization으로 변경할 수 있음

HTTP를 통해 웹사이트로 request가 왔는데, 가장 먼저 찾은 것은 jwt middleware였음

jwt middleware는 헤더에서 토큰을 가져와서 유저를 찾음

jwt middleware는 찾은 유저를 req에 넣었음

graphQL context function이 request 내부에서 유저를 가져와, context.user에 넣어줌

jwt middleware가 없기 때문에 첫번째 방어선으로 올라감

GraphQLModule.forRoot 안에 있는 context가 guard에 context를 제공함

connection이 있을 때, context에 아무 것도 보내지 않고 있음

Connection은 웹 소켓이 클라이언트와 서버 간의 연결을 설정하려고 할 때 발생함

context에 토큰이 있음

request가 존재하면 guard에 request를 보냄

connection.context는 토큰을 가지고 있음

connection.context는 HTTP의 req.headers와 같음

request와 connection은 동시에 작동하는게 아님

request는 HTTP이고 connection은 웹 소켓임

HTTP가 더 많은 정보를 가지고 있음

스텝 1은 jwt middleware를 제거함

스텝 2에서는 guard에 필요한 정보를 보냄

guard는 토큰을 추출하고, decode하고, 유저를 찾는 모든 일을 함

auth.guard에서는 token을 가져올 수 있음

토큰이 양쪽 request에 모두 있음

request가 존재하면 req.headers를 주고, 존재하지 않으면 connection을 줌

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 readyPotato를 subscription하고, me를 query 했을 때의 console 결과를 확인함(subscription은 웹 소켓 기반이라 playground, query는 http 기반이라 restClient.http 파일에서 진행함)

토큰이 양쪽에 다 있음

guard는 jwt가 하던 일을 해야함

HTTP resolver와 웹 소켓 resolver를 인증할 수 있음

app.module.ts의 내용 변경함

```javascript
context: ({ req, connection }) => {
  const TOKEN_KEY1 = "x-jwt";
  const TOKEN_KEY2 = "X-JWT";
  return {
    token: req ? req.headers[TOKEN_KEY1] : connection.context[TOKEN_KEY2],
  };
}
```

## 12.3 Subscription Authentication part Two

jwtService를 constructor 에 넣음 

토큰을 decode함

user만 받음

userService가 필요함

roles가 없으면 guard가 지나가라고 말함

roles가 없으면 보호가 필요하지 않기 때문임

roles가 없으면 누구나 쓸 수 있는 resolver임

context는 토큰을 줌

context에 토큰이 있으면, 토큰을 decode함

user를 찾음

user가 없다면 false를 return하고, roles에 Any가 있다면 true라고 함

usersModule을 import 해야함

userModule이 userService를 export 해서 repository 등등 모든걸 가져올 수 있음

guard를 provide했고, 모듈을 import 했고, 따라서 guard는 작동함

authUser는 graphQL context에서 user를 가져옴

guard가 Decorator보다 먼저 호출됨

guard가 user를 graphQL context에 추가하고, decorator가 호출되면 decorator가 graphQL context 내부에서 user를 찾음

누가 subscription을 요청하는지 알 수 있고, 누가 HTTP resolver를 호출하는지 알 수 있음

웹 소켓과 http에 대한 인증을 얻음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 readyPotato를 subscription 했을 때의 console 결과를 확인함(subscription은 웹 소켓 기반이라 playground에서 진행함)

## 12.4 PUB_SUB

orders resolver를 보면 PubSub, asyncIterator, publish를 사용하고 있음

resolver 제일 위에 PubSub이 생성되어 있는데 문제가 됨

PubSub이 전체 어플리케이션에서 하나여야함

user resolver에 다른 PubSub을 만들 수 없음

2개의 PubSub이 작동하고 서로를 찾지 못 하기 때문임

다른 PubSub에서 메세지도 보낼 수 없고, 아무 것도 publish 할 수 없음

결국은 PubSub은 하나여야함

사용자, 레스토랑, 주문 모듈에서 모두 동일한 PubSub을 호출하고 싶음

common module을 Global로 만듦

common 모듈에서 전체 어플리케이션을 위한 PubSub을 provide함

모듈이 생성되면 useValue로 new PubSub을 사용해서 app 전체에 provide함

common 모듈이 생성되면 PubSub도 생성됨

어디서든지 PUB_SUB을 import 할 수 있음

orders resolver의 Constructor나 PubSub을 사용하고 싶은 모든 곳에서, @Inject()를 해주면 됨

app의 모든 곳에서 중복 없이 PubSub 인스턴스를 쓸 수 있음

PUB_SUB을 가진 모듈이 import 되지 않았음

provide를 하고는 있지만 export하지 않음

PUB_SUB을 export함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 readyPotato를 subscription하고, potatoReady를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

PubSub이 잘 작동함

인증도 잘 작동함

dependency injection을 쓰면 어플리케이션에 원하는 것을 provide 할 수 있음

PubSub은 데모용임

서버에 단일 인스턴스로 있고 여러 개의 연결로 확장하지 않는 경우에만 작동함

Heroku나 AWS lightsail에 서버를 올리는 경우에 충분함

동시에 많은 서버를 가지고 있는 경우, PubSub으로 구현하려 하면 안 됨

PubSub은 분리된 별도의 서버에서 작동하기 때문임

동시에 10개의 서버가 있는 경우 다른 별도의 PubSub 인스턴스가 필요함

모든 서버가 동일한 PubSub 인스턴스로 통신 할 수 있음

동시에 10개의 서버가 있는 경우 한 서버가 트리거를 listening하는 서버가 되고, 다른 서버가 트리거에 publish 하는 서버면 동일한 PubSub이 아닌 경우, 작동하지 않음

PubSub을 다른 분리된 서버에 저장함

redis로 작업할 때는 graphql-redis-subscriptions를 설치함

RedisPubSub을 사용함

redis client에서는 host, port를 제공해줌

RedisPubSub을 만들고 publisher, subscriber는 비슷함

Cluster를 쓰면 많은 Node를 사용할 수도 있음

대부분은 클러스터가 필요하지 않음

redis DB에 요금을 내면 받는 domain name이랑 port에 연결하기만 하면 됨

대부분은 한 서버만 씀

## 12.5 Subscription Filter

filtering이라는걸 해봄

filtering을 해야하는 이유는 모든 update를 listen할 필요가 없기 때문임

모든 update를 알 필요는 없음

필요한 update만 볼 수 있으면 됨

filtering을 하지 않는다면 subscription은 의미가 없음

readyPotato는 mutation임

mutation에 potatoId라는 argument를 가지도록 만듦

potatoId argument는 number여야함

publish는 promise를 return함

potatoReady, readyPotato 모두 potatoId라는 argument를 가짐

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 readyPotato를 subscription하고, potatoReady를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

subscription인 readyPotato로, potatoId가 1인 potato의 update를 listening함

subscription이 등록되고 update되는걸 listening함

potatoReady에 potatoId가 8이라 함

potatoId가 1인 potato를 update하는걸 listening함

potatoId 8과 33을 ready됐다고 update하면, readyPotato subscription에 좋지 않은 결과가 보임

potatoId가 1인 potato를 update할 때만 알림을 받고 싶음

potato 33, 8이 ready됐다는 update는 상관없음

potatoId가 1인 경우에만 신경쓰고 싶음

id만 신경쓰면 됨

우리의 order를 제외하고는, 어떤 order의 update도 보고 싶지 않음

다른 restaurant에 들어오는 order를 보고 싶지 않음

내 restaurant에 들어오는 order만 보고 싶음

potatoId가 1인 potato가 update되는 걸 listening하고, potatoId가 1인 경우만 보이도록 만듦

filtering이 구현해줌

subscription decorator를 보면 option들이 있는데 그 중 하나가 filter임

filter에는 payload, variables, context를 주고 true, false를 return하도록 만들어야함

filter function이 false로 되어있음

potatoId 1을 기다리고 있는데, potatoId 33을 update해도 알림을 받고 있음

filter는 payload, variables, context를 가지는 function임

context는 이미 export되어 쓸 수 있는 상태임

context는 우리가 만든 graphql context임

return true를 함

update를 감지하고 있고 potato 99를 update하면, potato 99가 출력되는걸 볼 수 있음

payload는 readyPotato: Your potato 99 is ready를 가진 object임

variables는 listening을 시작하기 전에 subscription에 준 variables를 가진 object임

filter function이 무슨 variables를 보냈는지 알 수 있음

context에는 token, undefined인 request, user 등 모든게 다 있음

payload, variables를 기반으로 filter를 할 수 있고 나중에는 context.User로도 할 수 있음

context.User는 guard에 의해서 추가됨

readyPotato를 potatoId라 함

readyPotato를 가진 payload가 potatoId인 variable과 같은지 체크해봄

readyPotato에는 potatoId가 있음

potatoId는 listening을 시작하기 전 subscription에 준 variable에서 옴

readyPotato === potatoId를 return함

true라면 사용자가 update 알림을 받게 됨

payload에는 99가 있고 variables에는 1이 있음

원하는 event만 publish됨

## 12.6 Subscription Resolve

filter function은 현재 listening하는 사용자가 update 알림을 받아야하는지 말아야하는지 결정함

첫번째 argument는 payload임

두번째 argument는 resolver의 variables임

세번째는 context임

context에서는 User를 사용할 수 있음

filter에서 조건을 만족하면 true를 return함

resolve는 사용자가 받는 update 알림의 형태를 바꿔줌

type을 보면 resolve가 payload, args, context, info를 받고 있음

readyPotato를 payload로 줌

Your potato with the id ${readyPotato} is ready!를 return함

order를 update하면 order 내용 전체를 보낼 필요 없고 바뀐 부분만 보내면 됨

resolve를 이용해서 전체 말고 바뀐 부분만 보내면 됨

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 readyPotato를 subscription하고, potatoReady를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

readyPotato로 listening을 시작하고, potatoReady로 88을 보냄

아무 일도 일어나지 않음

pubSub은 db에서만 쓸 수 있는게 아님

driver가 실시간 위치를 보고할 때가 있는데, mutation이 db에 접근하지 않음

message를 보내더라도 db를 거치지 않음

driver가 위치를 보고하면 db에 저장하지 않고 pubSub에 push하도록 만들 수 있음

driver의 위치를 db에 저장할 필요는 없음

filter는 true나 false를 return함

resolve는 subscription이 알려야하는걸 return하면 됨

resolve는 output을 변형시켜줌

resolver가 최종적으로 return하는 값은 asyncIterator가 됨

subscription function에서 variables를 가지고 asyncIterator를 return함

유저가 update알림을 받을지 말지는 filter가 결정함

resolve는 subscription의 output 모습을 바꿔줌

restaurant owner는 dashboard에서 새로 들어오는 order들을 보게 됨(pending orders)

owner를 위해 dashboard에서 보여지는 order임

실시간으로 새 order들을 보여줌

유저가 order를 만들면 화면에서 customer(고객)을 위한 order status를 볼 수 있음

order가 cooked(조리완료)되면 driver에게 픽업할 order가 있다고 알림을 줌(delivery person을 위한 pending pickup order)

언제 알림을 publish하고, 누가 subscription을 만들지 알아야함

유저가 order를 만들면, newOrder event를 trigger함

pending orders resolver가 newOrder event에 listening해야됨

createOrder라는 resolver로 trigger됨

createOrder(newOrder)가 trigger함

pending orders는 newOrder trigger를 listening하도록 함

order status는 orderUpdate라는 trigger를 listening하도록 함

editOrder라는 resolver로 trigger되도록 만듦

editOrder가 order status를 update할 때마다 orderUpdate를 trigger함

pending pickup order는 orderUpdate를 listening함

editOrder(orderUpdate)에 의해 trigger됨

유저가 order를 만들 때 createOrder라는 resolver를 사용함

resolver는 이미 만들어져 있음

newOrder라는 event를 trigger함

restaurant owner가 newOreder event를 listening하고 있다가 유저가 order를 만들면, restaurant owner가 본인 restaurant에 새로 들어오는 order를 listening함

owner가 order를 승인하고 hungry사람(order를 만든 유저)의 order가 승인되면, 화면에서 order status를 보여줌

order가 cooking중인걸 보게 됨

owner가 editOrder resolver를 사용해서 음식이 cooked되었다고 알리면, orderUpdate event를 trigger함

orderUpdate event는 customer와 owner가 listening을 하고 있음

그런데 orderUpdate event가 생기고 order status가 cooked이면, pickup guy도 이 event를 listening함

해당 order에 driver가 등록될거고 모두가 order status를 볼 수 있음

customer는 order가 승인되고, 픽업되고, 요리되고, 배달되는 모든 과정을 볼 수 있음

cooking person(owner)은 order가 픽업되고, 배달되는걸 봄

delivery driver는 pending pickup order부터 할 일이 생김

delivery driver는 order를 픽업해서 유저에게 갖다주고 completed 버튼을 누름

resolver 3개를 만들어야함

하나는 owner가 restaurant에 들어오는 order를 listen함

다른 하나는 customer, delivery, owner가 특정 id의 order가 update되는걸 봄

또 다른 하나는 delivery guy를 위한 pending pickup order resolver임

## 12.7 pendingOrders Subscription part One

pending orders subscription resolver를 만듦

resolver가 새로운 order를 return함

새로운 order가 들어오면 해당 order를 return함

Role을 사용해서 Owner만 resolver를 사용할 수 있도록 함

this.pubSub.asyncIterator()를 return 하고 안에 trigger를 작성함

trigger는 string이여야함

constants 파일 안에 trigger를 작성함

app의 많은 곳에서 반복해서 씀

pendingOrders는 NEW_PENDING_ORDERS를 listening함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 pendingOrders를 subscription함

```javascript
subscription {
  pendingOrders {
    id
    items {
      dish {
        name
      }
      options {
        name
        choice
      }
    }
  }
}
```

subscription { pendingOrders }를 하면 선택할 수 있는게 나오는데 id, items를 선택하고 items에서 dish를 선택함

options에서 name, choice도 선택함

정보를 위해 order의 id가 필요하고 유저가 뭘 주문했는지 알려면 order의 items도 필요함

dish에 subfield가 필요함

dish의 name을 필요로 함

NEW_PENDING_ORDER를 trigger할 수 있는건 createOrder service뿐이어야함

Order resolver에서 했던 것처럼 order service에도 pubSub를 inject해주면 됨

order를 save하고 나서 모든게 괜찮으면 await this.pubSub하고 NEW_PENDING_ORDER를 publish함

payload를 줘야함

payload는 resolver의 이름이어야하니까 pendingOrders로 하면 됨

새로 생성된 order를 payload로 보냄

resolver는 NEW_PENDING_ORDER라는 trigger의 asyncIterator를 return함

trigger는 constants 파일에 작성함 

string이라서 실수하는걸 방지하고 싶음

trigger는 createOrder를 하면 발생함

새로운 order를 만들면 NEW_PENDING_ORDER를 발생시킴

filtering을 하지 않았음

order를 filter 해야함

restaurant에 생성된 새로운 order만을 보여주고 싶음

payload를 추가하고 variables는 생략하고 User로 쓸 context는 추가함

return은 true로 함

filter는 true나 false를 return 해야함

filter에서는 order가 만들어진 restaurant이 context.User의 restaurant인지 체크함

asyncIterator와 publish가 작동하는지 테스트를 먼저 해봄

pendingOrders를 listening하고 있음

customer token으로 createOrder를 mutation함

고객쪽에서 owner의 restaurant에 order를 만듦

order를 만들었고 trigger가 작동하는지 확인함

console을 보면 payload인 pendingOrders에 모든 relationship을 가진 Order도 있음

customer, restaurant, items, customerId까지 필요한 모든 정보가 포함되어있음

subscription을 trigger하고 잘 처리하고 있음

restaurant owner쪽이 order를 잘 받고 있는걸 볼 수 있음

filtering을 하지 않았음

filtering을 해줘야함

filter는 restaurant이 owner id를 가지고 있는지 확인하도록 만듦

restaurant에 owner id가 없음

restaurant의 owner가 context의 user와 같은지 확인해줌

context에 token과 user가 있음

누가 subscription을 listening하고 있는지 알 수 있음

그래야 유저한테 restaurant을 보여줄지 말지 결정할 수 있음

## 12.8 pendingOrders Subscription part Two

payload에서 봤듯이 owner id가 포함되어 있지 않음

listening 중에 다시 order를 만들면, payload에 restaurant의 owner id가 없다는걸 알 수 있음

filter function에서 restaurant을 search해야 할 수도 있음

object가 order뿐만이 아니라 ownerId도 가지도록 함

ownerId가 payload에 들어있지 않기 때문임

누가 customer인지 알 수 있고, restaurant이 어딘지 알 수 있음

restaurant의 owner는 알 수 없음

filter function에 ownerId를 보냄

restaurant은 ownerId를 가지고 있음

trigger는 restaurant에 보여줄 order와 유저에게 보여줄지말지 결정해주는 ownerId를 받음

payload를 보면 ownerId가 포함됨

customer, restaurant, items 등을 가진 order와 ownerId를 가지고 있음

context에는 token과 user가 있음

payload 안에 ownerId가 있고 context에 user가 있으니까, ownerId === user.id 를 return함

true라면 subscription을 listening하고 있는 유저가 order를 보게 됨

pendingOrders: { ownerId }로 해야함

listening을 시작하고 order를 만들면 작동은 하지만 에러가 나옴

data를 받긴 했는데 에러가 나왔옴

payload를 바꿨기 때문임

payload에는 order, ownerId가 있음

payload는 order였는데 지금은 order를 가진 object가 됨

resolve function을 추가함

resolve function에는 payload가 필요함

args, context, info는 신경쓰지 않음

payload만 필요함

payload를 return 해야함

payload는 pendingOrders이고 그 안에는 order object를 가지고 있음

order를 payload로 return함

전에는 pendingOrders가 order 그 자체였기 때문에 바꿀 필요가 없었음

지금은 publish()의 payload를 바꿨기 때문에 resolve의 payload도 바꿔줘야함

subscription이 order를 return 한다하고 실제로는 order와 ownerId를 return 했음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 pendingOrders를 subscription하고, createOrder를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

```javascript
subscription {
  pendingOrders {
    id
    items {
      dish {
        name
      }
      options {
        name
        choice
      }
    }
  }
}
```

ownerId가 user.id와 같고 user.id는 subscription을 listening하고 있음

args를 쓰는대신 _를 써서 variables는 신경쓰지 않는다는걸 나타냄

user.id가 1이라 하고 order를 받지 않게 함

order를 받지 않아야함

listening을 시작한 뒤 order를 만들면 아무 것도 받지 않고 있음

ownerId와 user.id가 다르기 때문임

pending pickup order는 owner가 음식 준비를 완료하고 픽업할 준비가 되면 trigger되는 subscription임
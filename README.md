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

- Add Driver to Order

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

## 12.9 cookedOrders

pending pickup order를 만듦

driver만 볼 수 있는 기능임

Order를 return함

Role에 Delivery를 추가함

this.pubSub.asyncInterator()를 return함 

안에는 trigger를 써줌

constants 파일에 trigger를 만듦

NEW_COOKED_ORDER를 trigger함

NEW_COOKED_ORDER는 editOrder에 의해 trigger됨

editOrder는 restaurant owner가 order를 update할 때 씀

trigger를 publish함

newOrder resolver에서 this.orders.save()를 했고 payload로 order를 return함

order를 subscription으로 곧장 보내도 문제 없었음

이미 존재하는 entity를 save하고 create하는 것의 차이를 보여줌

entity를 create할 때는 save method가 create된 entity를 return함

entity를 save할 때는 entity 전체를 return하지 않음

update를 하면 save가 뭘 return하는지 확인함

id, status, updatedAt을 받았고 total은 null임

pgAdmin을 refresh를 해보면 total이 12이고 status가 cooked인걸 볼 수 있음

update된 내용을 못 받고 있음

order에 정말 많은 relationship이 있는데도 내가 보낸 id, status와 가지고 있는 column만 받았음

relationship을 전혀 받지 못하고 있음

order가 가진 column을 가져오지만 값을 못 가져오고 있음

order에 total이 없다는 말이 아님

save method가 order 전체를 return 하지 않음

delivery driver는 order 정보를 모두 필요로 함

cookedOrders는 Order를 return함

delivery driver를 위해 Order 전체를 return 받는게 정말 중요함

newOrder를 payload로 보낼 수 없음

NEW_COOKED_ORDER를 trigger함

owner가 NEW_COOKED_ORDER를 trigger할 수 있음

Order의 새로운 status가 OrderStatus.Cooked와 같은지 확인하고, new cooked order를 publish 해야함

payload는 resolver의 이름으로 줘야함

payload는 order가 되야함

this.orders.save()는 완벽한 Order를 주지 않음

이미 order가 존재하는지 체크를 했음

찾은 order를 db에 보낼 수 있음

order는 이전 status인 Cooking을 가지고 있음

{ ...order, status }로 바꿔줘야함

delivery driver에게 이전 order를 새로운 status와 보내주게 됨

entity를 update했을 때 entity 전체를 return 받지 못하는데, delivery driver한테는 entity 전체가 필요하기 때문임

subscription을 listening 할 준비가 됨

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 cookedOrders를 subscription하고, editOrder를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

```javascript
subscription {
  cookedOrders {
    restaurant {
      name
    }
    total
    customer {
      email
    }
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "delivery로 login mutation 했을 때 생성된 token 값"
}
```

customer가 null인데 order를 load 했을 때 restaurant만 load했기 때문임

user를 load하지 않았음

## 12.10 orderUpdates part One

eager relationships에 대해 봄

order status 부분도 마무리함

graphql로 customer의 email을 받으려고 함

실제로 받지는 못 함

order를 load할 때 customer를 달라고 안 했기 때문임

어떤 것을 같이 load 해야할지 생각해볼 필요가 있음

order entity에서 order를 load했을 때 driver, customer, restaurant이 뭔지 알고 싶음

driverId와 customerId가 있긴 하지만 대부분은 order를 가지고 driver, restaurant, customer를 보여줌

order 정보를 받아올 때 customer, driver 정보도 같이 받아야됨

graphql을 보면 어떤 relationship을 default로 load 해야하는지 알려줌

restaurant owner의 email을 받고 있음

frontend에서는 restaurants list와 owner의 email을 보여주는 query를 쓸 일이 없음

restaurants 정보를 받아올 때 owner를 default로 load할 필요가 없음

db에서 order를 받아올 때는 customer, driver를 같이 load할 필요가 있음

restaurants를 load할 때는 불필요한 정보니까 owner의 email이 필요없음

eager relation은 db에서 entity를 load할 때마다 자동으로 load되는 relationship을 말함

Category에 questions가 있고 Question에 categories가 있는 것을 볼 수 있는데 eager:true라는 object가 있음

Question을 load할 때마다 알아서 relationship을 load함

lazy relation은 한 번 access하면 load되고 type이 promise임

Category에 promise type인 questions가 있고, Question에도 promise type인 categories가 있음

원하는 relationship을 await 해야함

await order.customer 코드를 access해야 typeorm이 customer를 load하는데 이게 lazy relation임

lazy relation은 promise type이 있어야함

order에서 restaurant을 load하고 싶다면 await order.restaurant을 꼭 해줘야함

필요한 곳에 갖다 쓰면 됨

eager relation으로 만들건데 order를 받을 때마다 자동으로 relationship이 load됨

data를 어떻게 access하고 싶은지에 따라 달라짐

order를 받을 때마다 모든게 같이 load됨

eager relation과 lazy relation을 알아봄

access만 한다면 lazy relation을 쓰는 것도 나쁘지 않음

await를 해줘야한다는 것만 기억하면 됨

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 cookedOrders를 subscription하고, editOrder를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

```javascript
subscription {
  cookedOrders {
    restaurant {
      name
    }
    total
    customer {
      email
    }
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "delivery로 login mutation 했을 때 생성된 token 값"
}
```

console을 보면 에러가 없고 모든게 잘 작동하고 있음

listen을 시작함

order를 listening하고 있음

order를 update함

customer가 같이 load됨

eager relation을 쓸 때 너무 많은걸 load하면 안 됨

customer email에 restaurants를 받고 거기에서 owner의 email, restaurants를 받고, restaurants의 owner를 받으려하면 서버가 폭파될 수 있음

이런 문제를 graphql의 n+1 problem이라 하고 이걸 방지하는 방법이 있음

owner를 restaurant의 eager relation으로 만들 필요는 없음

order status를 만들기 시작함

orderUpdates에는 argument가 필요함

orderUpdates에 input이 필요함

규칙을 따라서 order-updates.dto.ts 파일을 생성함

orderUpdates에 output을 주지 않음

InputType만 만들면 됨

orderUpdates의 input은 id만 있으면 됨

지금까지 지켜온 규칙에 따라 만들고 있음

this.pubSub.asyncIterator()를 return함

NEW_ORDER_UPDATE를 만듦

editOrder가 NEW_ORDER_UPDATE를 trigger함

order가 성공적으로 update되었다면 await this.pubSub.publish(NEW_ORDER_UPDATE, )를 함

payload에는 orderUpdates로 새로운 order를 보냄

newOrder를 만듦

NEW_COOKED_ORDER는 driver에게만 갈거고 NEW_ORDER_UPDATE는 모두에게 감

일치하는 id를 listening하는 유저에게만 update를 publish하면 됨

필요한 id를 가진 potato의 update만 listening할 수 있었음

## 12.11 orderUpdates

orderUpdates subscription을 listening 할 수 있음

subscription이 잘 작동하는지 테스트함

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 orderUpdates를 subscription하고, editOrder를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

```javascript
subscription {
  orderUpdates(input: {
    id: 5
  }) {
    status
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "any role로 login mutation 했을 때 생성된 token 값"
}
```

orderUpdate에 input으로 id가 5인 order를 listen함

order말고 status를 받음

NEW_ORDER_UPDATE를 publish하면 trigger됨

payload가 어떻게 생겼는지 아니까 에러가 생기지는 않음

editOrder를 하면 Cooked를 받음

Cooking으로 해봄 

Cooking이 잘 나오는걸 보니 잘 작동하고 있음

어떤 update, order든 모두가 listening하고 있음

filter function을 좀 바꿔볼 수도 있음

cookedOrders에는 filter function을 쓰지 않았음

driver가 배달 가능한 order를 모두 볼 수 있게 하고 싶었기 때문임

filter function을 작성해줘야함

filter에 payload를 줘야하기 때문에 variable을 만듦

payload는 orderUpdates가 됨

typescript에서 에러가 나오지 않게 일단 filter가 true를 return하도록 함

variables를 console log함

variables에 뭐가 오는지 확인할 수 있음

정리하면 filter에는 payload, variables, context를 줘야함

listening을 시작함

Any가 listening하고 있으니까 잘 작동함

status가 Cooking임

variables에는 input으로 id: 5가 있음

variable의 이름이 input임

input을 console log함

refresh하고 listening, update하면 id: 5가 나옴

type을 추가할 수 있음

object가 Order type을 가진다고 함

input은 OrderUpdatesInput type을 가짐

user의 type은 User가 됨

variables에 해당하는 유저가 id: 5를 listening하고 있음

orderUpdates를 order라고 이름을 바꿈

order.id === input.id를 return함

유저가 원하는 order의 update만 볼 수 있음

전에는 유저가 모든 order의 update를 볼 수 있었는데 그렇게 하고 싶지 않음

listening을 시작함

order 5를 edit함

Cooking으로 update됨

order 4를 edit함

update가 보이지 않음

order 5를 Cooked로 update함 

Cooked가 보임

order에 관련된 유저들이 모두 subscription을 listening 할 수 있도록 만들어야함

owner, customer, driver만 update를 보게 됨

payload로 받고 있는 order를 console log 해봄

payload로 받고 있는 order에는 모든 정보가 다 들어있음

defensive programming이라는걸 해야함

user는 subscription을 request하고 있음

order에 관련된 사람들만 order의 update를 볼 수 있음

filter function으로 구현함

resolver에서 iterator를 return하지 않는 방법도 있음

service에서 return함

order를 찾고 canSeeOrder를 call하고나서 새 service에서 return하게 함

누구나 listening 할 수 있음

어떤 update도 받지 못할 수도 있지만 적어도 listening은 하고 있음

user.id를 모두 1로 바꿈

refresh하고 push하면 아무 update도 받지 못 함

id가 1인 경우에는 order와 관련이 없기 때문임

order가 eager relation과 같이 load되기 때문에 restaurant.ownerId를 쓸 수 있음

누구나 order를 edit 할 수 있음

우리가 request하는 order만 update를 보내고 있음

그리고 update를 받아야 하는 유저를 authorize하고 있음

filter function으로 구현함

argument의 이름을 다시 짓는 방법을 배웠고, typescript를 사용해서 object type을 명시하는 방법도 배움

payment로 넘어가기 전에 마지막으로 할 일은 order에 driver를 등록하는 것임

아직 resolver를 만들지 않았지만 정말 간단한 mutation임

driver가 order를 accept하면 order를 driver의 정보로 update함

## 12.12 takeOrder

payment로 넘어가기 전에 마지막으로 만들 resolver는 takeOrder임

acceptOrder라 해도 됨

delivery driver를 order에 등록함

@Mutation()이라 하고 먼저 dto를 만듦

take-order.dto.ts 파일을 생성함

Order를 import함

output도 있어야함

TakeOrderOutput이 올거고 Role을 작성할건데 Delivery guy만 takeOrder를 쓸 수 있음

input이 필요함

service를 만듦

driver는 User type이 됨

takeOrderOutput은 TakeOrderOutput type이 됨

login한 유저가 필요한데 AuthUser로 가져옴

this.ordersService.takeOrder()를 return함

order를 가져옴

id를 가져옴

orderId로 이름을 바꿈

order의 delivery guy를 driver로 update하면 됨

id는 orderId로 하면 되고 driver는 User여야함

save를 쓴 곳에 뭔가를 써도 typescript가 자동완성을 해주지 않음

그렇다고 작동하지 않는다는게 아님

object에 []를 추가하면 typescript가 자동완성을 지원함

type이 달라서 생기는 문제임

그렇다고 작동하지 않는건 아님

자동완성을 보고 싶다면 array 안으로 옮기면 됨

orderId와 driver를 update함

driver는 User type임

NEW_ORDER_UPDATE를 publish 해야함

newOrder 대신에 order를 쓰면 됨

그리고 driver를 포함시켜줌

order를 load하면 order에 eager relationship이 있다는 것을 앎

order에 모든 정보가 load됨

orders.save를 await하면 됨

좀 더 확실하게 하고 싶다면 order.driver가 있을 때 ok:false와 error: this order already has a driver를 return하면 됨

publish가 끝나면 ok:true를 return하면 됨

try~catch 안에 넣음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 orderUpdates를 subscription하고, takeOrder와 editOrder를 mutation 했을 때의 결과를 확인함(subscription은 웹 소켓 기반이라 playground, mutation은 http 기반이라 restClient.http 파일에서 진행함)

```javascript
subscription {
  orderUpdates(input: {
    id: 2
  }) {
    status
    driver {
      email
    }
  }
}
```

왼쪽 아래 HTTP HEADERS에

```javascript
{
  "X-JWT": "any role로 login mutation 했을 때 생성된 token 값"
}
```

subscription을 테스트해봄

owner의 token을 확인함

order id 2를 listening함

mutation은 takeOrder가 됨

takeOrder, input, order의 id는 2가 됨

listening을 시작함

작동하는지 확인할 수 있도록 status와 driver의 email을 받아봄

id는 2여야함

db에서 customer를 delivery로 바꿈

resolver가 작동하는지 확인함

status는 그대로지만 driver가 추가됨

보다시피 subscription이 잘 작동함

유저가 order를 만들고 restaurant이 order를 accept하면 유저가 볼 수 있음

restaurant이 요리를 완료해도 유저가 확인할 수 있음

driver가 order를 take하면 유저가 driver를 확인할 수 있음

driver로 editOrder를 해봄

driver가 id 2인 order의 status를 PickedUp으로 바꾸면, driver가 준비된 음식을 픽업했다는 뜻임

새로운 update를 받아 PickedUp이 생김

driver가 status를 Delivered로 update하면 Delivered를 볼 수 있음

보다시피 Cooking, PickedUp, Delivered를 모두 확인할 수 있음

payment로 넘어갈건데 backend에서는 길게 다루지 않음

어떤 restaurant이 우리한테 광고비를 주는지 알아야하고, 그런 restaurant들을 어떻게 promote할지 생각해봐야함

cron은 chronological(시간순, 연대순)이라는 단어에서 옴

시간을 뜻하는 고대 그리스어 cronos에서 왔을 수도 있음

cron job, cronos job, time job은 서버에 5분마다 어떤 function을 실행시키도록 만들 수 있음

이런게 바로 cron job임

매주 월요일 7pm에 function을 실행시킬 수도 있음

노마드코더 챌린지를 해봤다면 매일 아침 6시에 이메일을 받았을텐데, 그렇게 이메일을 보내는 일이 바로 cron job임

챌린지가 시작하기 전 일요일에 보내는 이메일도 cron job에 해당됨

5분마다, 5일마다, 1년에 한 번씩 function을 실행해주는 프로그램을 만들 수 있음

nestjs에서만 쓸 수 있는건 아니지만 nestjs에서 cron job을 만들기 쉬움

## 13.0 Payment Introduction

이번 섹션에서는 payments(결제) module을 만듦

restaurant(음식점) 주인이 restaurant를 promote(홍보)하면, 비용을 내야함

우리가 일주일 동안 홍보해 주는 조건으로 그 돈을 받음

누가 검색하면, 그 restaurant을 먼저 보여줌

또는 메인 페이지에 음식점을 보여줌

요점은, 우리는 비용을 청구하고, 음식점들이 우리에게 돈을 내면, 우리는 검색 페이지/메인 페이지 또는 우리가 원하는 곳에 넣어서 promote해줌

왜 프로모션/홍보용 결제를 만드는가

paddle이라는 결제 프로그램을 쓸 계획임

paddle은 거의 모든 나라에 다 지원됨

paddle은 은행 송금이나 여러 방법을 통해 결제받을 수 있음

돈 받기 쉽고, 회사가 없어도, 개인으로 돈을 받을 수 있음

paddle의 가장 큰 장벽은 디지털 내용물만 결제할 수 있다는 것임

실제 물건은 팔 수 없음

티셔츠 회사를 운영한다면 paddle을 쓸 수 없음

온라인으로 커피를 팔고 싶어도 paddle을 쓸 수 없음

paddle은 소프트웨어와 디지털 내용물만 거래 가능함

노마드 코더처럼 웹사이트가 있고, 강의를 팔고 싶다면 paddle을 쓸 수 있음

온라인 ebook 서점을 운영하고, 사람들이 온라인으로 책을 구매하고 온라인으로만 책을 볼 수 있다면 그런 경우에도 paddle을 쓸 수 있음

웹사이트를 만들었고 멤버십을 판매하는데, 프로나 프리미엄 멤버십 같은게 있고 한 달에 20$면 paddle을 쓸 수 있음

소프트웨어 서비스 종사자고 API를 만들었음

사람들에게 API를 쓸 때마다 10$를 청구하려고 하면 paddle을 쓸 수 있음

비디오 게임을 운영하고 사람들에게 코인을 팔고 싶으면, paddle을 쓰면 됨

Airbnb나 배달음식 서비스를 만들고 싶다면 다른 결제 프로그램을 써야함

앱으로 배달 음식 서비스를 만들거나, Airbnb처럼 호텔이나 방을 빌리고 싶다면, 다른 결제 프로그램을 써야함

stripe는 큰 회사들이 쓰는 프로그램임

stripe의 가장 큰 문제는 한국에서 지원이 안 됨

몇몇 나라에만 지원됨

stripe로 시작하는 것 또한 쉽지 않음

법적으로 설립된 실제 회사가 있어야 stripe를 쓸 수 있음

회사 계좌 또한 있어야함

회사도 만들고, 등록도 해야 하고, 회사 계좌도 개설해야 하고, 쉽지 않음

이 강의는 stripe로 진행되지 않음

uber, github, dropbox가 Braintree를 결제 프로그램으로 씀

하지만 모든 국가에 다 지원되는 프로그램은 아님

실제 회사가 꼭 있어야함

시작하기 쉽지 않음

paddle은 인디-개발자들도 웹사이트를 만들고 바로 결제할 수 있게 해줌

무료 to-do 앱을 만들고 싶고, to-do를 export하고 싶으면 돈을 내야함

paddle은 회사인지 아닌지 신경 안 씀

개인에 집중하는 회사임

물론 무엇을 파는지 인증해야함

paddle은 많은 백엔드가 필요하지 않음

프론트에 이미 많음

신용카드를 handle할 필요도 없고, 신용카드의 verification, 번호, 보안도 handle할 필요가 없음

Framer, Macpaw도 paddle을 씀

Macpaw는 clean my mac을 만듦

Renderforest는 온라인 비디오 편집을 이용한 브랜딩 플랫폼임

온라인으로 비디오를 만들고, paddle로 돈을 냄

paddle은 프론트엔드 중심임

그 부분은 리액트로 진행하고, 프론트엔드에서 paddle 결제가 되는 resolver들을 simulate함

홍보와 체크인 프로모션을 다루는 결제 부분을 함

나머지는 프론트엔드에서 다룸

## 13.1 Payment Module

payments module을 만들기 위해 터미널에 nest g module payments를 실행함

app.module.ts에도 추가됨

payment.entity.ts를 만듦

entity는 transaction id가 필요함

paddle에서 transaction id를 받음

paddle이 프론트엔드에서 주는 정보들에 대해 알게 되면, 나중에 이 모델을 바꿀 수도 있음

payments에도 user가 있음

payment는 user가 있고, user는 많은 payment가 있음

onDelete는 SET NULL함

user가 떠나면 그의 payment도 지우고 싶음

user는 payments array를 가짐

user는 payment도 갖게 됨

Payment가 CoreEntity가 있다는 것을 꼭 기억해야함

CoreEntity 안에 createAt이 있음

createAt이 중요함

user가 언제 결제했는지를 바탕으로 음식점을 홍보하기 때문임

entity를 app module에 install함

TypeOrm에 Payment를 넣음

터미널에 npm run start:dev 입력하면 pgAdmin의 payment 테이블에 id, createdAt, updatedAt, transaction id, user id, restaurant id Column이 있음

user가 음식점을 여러 개 소유할 수 있게 웹사이트를 디자인함

코드가 길어지기 때문에 user가 음식점을 여러 개 소유할 수 있게 만들면 안 됨

user가 돈을 내면 user가 어떤 음식점을 홍보하고 싶은지 선택할 수 있게 해줘야함

user는 여러 음식점을 소유할 수 있음

payment에 restaurant도 생김

user가 여러 음식점 중 자기가 홍보하고 싶은 곳을 선택해야 하기 때문임

restaurant은 order가 많음

restaurant에서 payment에 접근할 필요가 없음

restaurant도 있고, RelationId를 만듦

RelationId는 payment를 받음

라이선스류에도 paddle을 쓸 수 있음

fast spring이라는 프로그램을 씀

payments, entities를 마무리함

## 13.2 createPayment part One

resolver와 service를 만듦

OneToMany가 다른 편에 없어도 ManyToOne을 생성할 수 있음

restaurant에 OneToMany를 안 만듦

restaurant이 갖고 있는 payments에 관심 없기 때문임

OneToMany는 ManyToOne없이 존재할 수 없음

ManyToOne 관계에만 집중하고 싶다면, 관련 entity에 OneToMany 없이 정의할 수 있음

restaurant.payments에 관심이 없음

user.payments는 신경 써야함

user는 OneToMany가 있음

payments resolver를 만듦

Resolver of를 씀

service도 import함

payments.service.ts를 생성함

서비스에 Injectable이 포함되어야함

service는 아무 것도 extend 하지 않음

Resolver를 만듦

modules provider에 payment resolver를 넣음

Mutation을 만듦

payment를 만들 때 필요한 것은 transaction id임

Payment에서 transaction id를 가져오고 싶음

restaurant id도 필요함

restaurant id에 field를 주면 됨

graphql에 뜸

## 13.3 createPayment part Two

Owner만 resolver에 접근할 수 있게 만듦

AuthUser가 필요함

홍보하고 싶은 음식점이 그 user의 음식점이 맞는지 확인하고 싶음

promise를 return함

payment를 create함

payment input은 transaction id와 restaurant id가 포함되어있음

restaurant를 find함

restaurant repository를 inject함

restaurant를 input으로 추가 안 했음

항상 방어적인 프로그래밍을 해야함

김 아무개가 해당 음식점 주인이 아닐 수 있음

payments를 create함

user는 restaurant의 owner(주인)임

try catch 안에 집어넣음

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
  editOrder(input: EditOrderInput!): EditOrderOutput!
  takeOrder(input: TakeOrderInput!): TakeOrderOutput!
  createPayment(input: CreatePaymentInput!): CreatePaymentOutput!
}

input CreatePaymentInput {
  transactionId: String!
  restaurantId: Int!
}

type CreatePaymentOutput {
  error: String
  ok: Boolean!
}

type Payment {
  id: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  transactionId: String!
  user: User!
  restaurant: Restaurant!
  restaurantId: Int!
}
```

볼 수 있음

createPayment를 mutation함(restClient.http 파일에서 진행함)

transactionId는 integer면 안 됨

paddle이 숫자를 안 줄 수도 있음

id가 10인 restaurant을 가지고 있음

pgAdmin에서 payment record가 생성된 것을 확인함

user가 자기 payment를 가져올 수 있어야함

새로운 resolver를 payment resolver에 만듦

payment를 수정할 수도, payment를 삭제할 수도 없음

payment를 create하고, 만든 payments만 볼 수 있음

## 13.4 getPayments Resolver

get-payments 파일을 만듦

input은 아무 것도 안 받음

query는 GetPaymentsOutput을 return함

me resolver는 end relationship을 로드하지 않음

me는 로그인 되어있는 user를 return함

me는 user object만 return함

어떠한 relationship도 로드하지 않음

eager relationship에서 주의해야 할 점은 pagination을 할 수 없음

filter도 할 수 있음

prototyping할 때 유용함

한 model에서 다 가져올 수 있기 때문임

eager: true인 이상 relationship을 다 가져올 수 있음

문제는 덩치가 커졌을 때임

덩치가 커져서 user가 payments 수천 개 있는데, paginate 못하고, eager relationship만 request하면 문제가 생김

prototyping하는 중이라면 eager relationship을 쓰면 바로 실행됨

try catch 블록에 넣음

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 getPayments를 query 했을 때의 결과를 확인함(restClient.http 파일에서 진행함)

eager relationship과 작업하면 가끔 test하기 힘듦

한 가지 일을 처리하는 resolver를 갖는 게 중요함

오직 user만 me resolver에 있는게 좋음

하나의 resolver가 모든 것을 다 받는 구조면 무거워질 가능성이 큼

createPayments와 getPayments를 할 수 있음

## 13.5 Task Scheduling is Awesome

많은 애플리케이션들이 프로덕션 때 Task scheduling이 필요하다는 것을 깨닫게 됨

Task scheduling은 원하는 time interval, 또는 정해진 시간과 날짜에 function을 실행할 수 있게 만듦

function을 매초마다 실행하고 싶음

또는 function을 금요일 오전 10:30마다 실행하고 싶음

nest.js/schedule은 node-cron이라는 패키지 위에서 나옴

nest.js가 만든건 아니고 nest.js의 방식을 따름

config를 쓰면 process.env를 가져올 수 있음

dot.env라는 패키지 위에서 나옴

task scheduling도 비슷함

터미널에 npm install --save @nestjs/schedule@0.4.1 입력

app.module.ts에 설치함

service 안에 cron decorator를 쓰면 됨

cron decorator를 cron pattern와 함께 call함

매분 45초에 function이 실행이 됨

별표시는 '매' 즉 '모든' 것을 포함한다는 의미고, Range는 1-3, 또는 예를 들자면 1과 5를 의미하고, 별표시/2는 step을 의미함 

2씩 간격이라는 뜻임

초(생략가능), 분, 시, 일자, 월, 요일 순서임

매요일, 매월, 매일자, 매시, 매분 45초에 실행됨

cron pattern을 보면, 매초 실행됨

매분 45초에 실행됨

매시 10분에 실행됨

30분마다인데, 9-17시 사이의 매 30분마다 실행됨

24시간으로 시간이 설정되어 있기 때문에, 9:00-5:00 p.m.라는 뜻임

매 0초, 30분마다, 9:00-17:00, 매일자, 매월, 매요일 실행됨

30분마다, 9:00-17:00 사이임

0초, 30분, 11시, 매일, 매월, 1요일은 월요일, 5요일은 금요일임

심지어 expression도 쓸 수 있음

프로모션을 check함

payments를 check함

createPayment 부분은 restaurant에 아직 아무 영향도 주고 있지 않음

얼른 액션을 넣어야함

createPayment를 하면 restaurant는 promote되어야함

checkForPayments를 매초마다 함

Cron을 함

매요일, 매월, 매일자, 매시, 매분 30초에 실행하고 싶음

매분 30초에 실행됨

'30초마다'가 아님

매분 30초에 실행되는 것을 의미함

매분, 초침이 30을 가리킬 때에 실행됨

매 30초마다 하고 싶을 수도 있음

Cron job과는 완전히 다름

매분 30초, 매시 20분, 매일 5시라고 하는 것은 매시, 매일, 매초, 매 10초와는 완전히 다른 의미임

이럴 때는 interval을 씀

interval은 JavaScript의 interval과 비슷함(매 몇 초)

interval을 만들어서, 매 30초라고 적음

interval은 매 30초임

매 5초로 바꿈

Interval payment를 check함

cron payment와는 다름

예를 들면, 나는 월요일마다 웹사이트에 무슨 일을 함

새벽 4:30분처럼 웹사이트 이용자가 적은, 아무도 없는 시간대에 cron jobs을 만들고 매일 4시 0분에 백업을 할 수 있음

그게 cron job을 쓰는 경우임

cron은 1번 일어났지만 interval은 여러 번 일어남

timeout도 있음

timeout은 interval이랑 비슷한 건데, 이건 나중에 발생함

1번만 실행함

1번, 딱 1번만 실행됨

코드를 저장하고 application이 시작되면 바로 timeout이 실행됨

application 시작하고 20초 뒤라고 함

10초 지나갔고, 이제 곧 congrats가 보임

timeout인 congrats가 나옴

이렇게 decorator로 작업하는 것을 declarative식이라고 함

또한 dynamic식이라는 것도 있음

만약 intervals, cron jobs, timeout과 작업하고 싶다면 이름을 붙이면 됨

예를 들어, job을 stop할 수 있음

첫째로 schedulerRegistry로부터 import 해야하고 constructor안에 넣어야함

이름을 붙이면, 나중에 job을 만들어서 job을 stop할 수 있음

job을 stop하고 싶을 때도 있고, job의 last date를 check하고 싶을 때도 있음

모든 cron job에서 job을 get함

job에 이름을 붙임

원한다면 addCronJob도 할 수 있음

이게 그 dynamic API임

declarative는 코드에서 cron job을 만듦

가끔 addCronJob, addInterval, addTimeout할 수도 있음

getCronJob을 쓰고 싶다면 name(이름)이 필요함

이름을 myJob으로 함

lastDate도 받을 수 있음

또한 stop, start, setTime, lastDate, nextDate도 할 수 있음

CronJob을 클래스로 만들 수 있음

deleteCronJob도 할 수 있음

interval을 만들거나 set할 수 있음

delete할 수도 있음

timeout을 get하고, scheduler에 add하거나, timeout을 set, delete할 수 있음

getTimeout을 통해서 모든 timeout을 다 볼 수도 있음

가끔 내가 가진 cron job, timeout, interval이 몇 개인지 보고 싶음

초는 30초, 분, 시, 일자, 월, 요일 다 true로 나옴

Timeout은 자바스크립트 timeout임

stop하고 싶다면 stop해도 됨

job.stop()을 씀

timeout, interval, cron job이 있고, dynamic하게 할 수도 있음

cron job을 get할 수도 있고 interval, timeouts도 get할 수 있음

모두 dynamic하게 intervals, timeouts, cron jobs을 set하거나 add할 수 있음

예를 들면, user가 register할 때, cron job, interval, timeout을 추가할 수 있음

## 13.6 Promoting Restaurants

payment를 create할 때, restaurant를 promote하고 싶음

restaurant entity를 수정함

type Date인 다른 column을 만듦

null인 value가 column isPromoted에 포함되어있음

이미 restaurants이 있기 때문임

restaurants은 이미 존재하지만, 아직 isPromoted column이 없음

default를 설정함

데이터베이스 column에 false가 default라고 씀

promotedUntil은 nullable이 true임

payment를 create할 때(여기 create payment에서 지불할 때) restaurant.isPromoted = true임

restaurant을 얼마동안 promote할지 계산해야함

현재 날짜를 가져와야함

date를 보면 지금 녹화하고 있는 시간이 나옴

date.getDate()를 하면 일자가 나옴

3월 24일에 녹화 중임

date.setDate()는 milliseconds를 return함

restaurant를 며칠동안 promote할지 더해야함

promotedUntil의 type이 date고, date도 type date이기 때문에 pass함

setDate는 시작 때 썼던 date를 바꿈

방금 update한 restaurant을 save 해야함

graphql로 가서 test함

id 10번 restaurant은 promoted도 false, promotedUntil도 null임

터미널에 npm run start:dev 입력하여 localhost:3000/graphql 접속하고 playground를 실행하여 createPayment를 mutation 했을 때의 결과를 확인함(restClient.http 파일에서 진행함)

payment에 transaction id 아무거나 넣고, restaurant id 10번으로 다시 create함

restaurant는 promoted도 됐고, promotedUntil도 있음

그들의 돈을 받으면 7일 동안 restaurant을 promote 해줘야함

원한다면 createPayment에 요소를 더 추가해서 더 복잡하게 만들 수도 있음

30일동안 promote한다든지 마음대로 정할 수 있음

웹사이트에 promotion을 반영해야함

allRestaurants으로 가서 몇 가지 수정함

promote한 restaurant이 먼저 뜨게 만들어야함

category 안에 있는 restaurant들을 promote할 수도 있음

promote하는 restaurant들을 category 피자에서 보여주는 것처럼 allRestaurants로 가면 promote하는 restaurant들을 다 볼 수 있음

isPromoted된 친구가 처음으로 올라오길 원함

restaurants를 query함

restaurants를 find하는 곳으로 가서 allRestaurants를 클릭하고 order를 쓰면 됨

옵션은 많음

그 중 하나가 isPromoted임

ascending(오름차순) 그리고 descending(내림차순) 옵션이 있음

descending이 필요함

isPromoted를 DESC로 설정하니까 BBQui는 promote가 되고 있음

위에서부터 promoted된 식당을 보여줌

descending, ascending이라는 옵션 두 개(또는 1, -1)가 있음

1이 descending, -1이 ascending임

payments service 안에 있는 restaurant를 check함

promotedUntil이 오늘 날짜보다 적으면 promote를 끝내야함

column에 있는 date가 현재 날짜보다 적으면, promote를 끝내야함

## 13.7 Promoting Restaurants part Two

Cron job 또는 interval을 써서, 날짜가 만료되었음에도 여전히 promote되고 있는 restaurant들을 체크함

isPromoted: true로 find함

promote한 restaurant들을 가지고, restaurants.forEach를 통해, restaurant의 만료시점이 현재 날짜보다 더 적은지 확인함

date도 숫자니까 오늘보다 숫자가 더 적으면 과거라는 의미임

forEach를 하거나 typeORM의 operator를 활용할 수도 있음

예를 들면 LessThan, LessThanOrEqual, MoreThan이 있음

오늘의 날짜는 어제의 날짜보다 큼

restaurants들 중 promotedUntil이 오늘보다 LessThan인 친구들을 찾으면 됨

restaurants들 중 promotedUntil 날짜가 오늘보다 LessThan인 음식점들을 찾고 있음

restaurant의 promotedUntil date가 오늘보다 LessThan이면, 더 이상 promote되면 안 됨

내 서버였다면, 아마 24시 0분, 매일이라는 cron을 씀

매우 정확하게 하고 싶다면 매분으로도 설정할 수 있음

interval 또는 cron 중 하나를 택하면 됨

내 서버였으면 cron을 씀

하지만 interval이 더 test하기 빠르고 console에 바로 보이니까 interval을 씀

매 2초로 함

restaurants을 console.log함

restaurant을 못 찾음

restaurant 못 찾은게 당연함

promotedUntil이 31일까지 진행됨

pgAdmin restaurant table의 promotedUntil column을 어제까지라고 수정함

3월 23일임

restaurant 10은 이제 promoted false고 promotedUntil null임

잘 실행됨

23일까지 promotedUntil이고, 오늘은 24일임

몇 백개의 영상으로 payment를 끝냄

터미널에 npm run start:dev 입력하여 2초 뒤 restaurant record가 변경되는지 확인함

## 13.8 Backend Conclusions

dynamic module도 만듦

authentication도 실행해보고, guard가 무엇인지도 알아보고, middleware도 배움

roles를 위해 우리만의 decorator도 만들어봄

boss같은 map type도 사용함

resolver도 있고, subscription authentication 안에 있는 subscriptions와 sending emails도 만듦

email은 완벽하게 발송됨

심지어 configuration object도 validate하고, users module도 end-to-end test를 했음

module도 end-to-end test했고, mocking도 했음

모든 type들이 있고, 어떻게 백엔드의 schema를 활용할건지 볼 수 있음

react로 프론트엔드를 만들 때 도와줌

data를 request할 때 정확히 무엇을 request 해야하는지도 알고, 다 dtos에서 나옴

react js code조차 schema에 있는 dtos를 봄

entities를 보면 한 파일 안에 graphql, validation, database도 하고 있음

## 20.0 Order Dashboard Routes

방금 내 database의 Role을 owner로 바꿨음

왜냐하면 지금부터는 식당 사장님 부분을 작업함

식당 주인 부분에서 가장 중요한 route들을 작업함

restaurant(식당)을 만들 거고, dish(메뉴)를 업로드하고, 음식점 dashboard를 만들거고, 음식점의 매출 수익을 보여주는 그래프도 만듦

그래서 첫번째로 할 일은 Role을 owner로 만드는 것임

아니면 새로운 사용자를 만들 수도 있음

그렇게 해도 문제 없음

웹사이트를 새로고침해보면 보이는대로 page not found라고 뜸

당연한 일임

왜냐하면 아직 owner에 route가 없음

client에만 route가 있음

그러니 owner에 route를 생성해봄

data.me.role이 "Owner"와 일치한다면, 몇가지 routes를 지니게 됨

이 route들은 ClientRoutes와 상당히 다름

하지만 여기의 route 두개는 여기에 그대로 놔두고 싶음

이 두 route는 고객(client)과 음식점 주인과 운전자(driver) 자기의 이메일을 confirm하고 프로필을 수정할 수 있도록 모두가 공유함

다만 여기의 이 key 부분이 좀 신경쓰임

이 부분도 좀 개선함

이렇게 ClientRoutes처럼 쓰고 array를 보여주는 방식 대신에 client route들의 map을 만듦

client route는 route들의 array가 됨

하지만 route들은 이것과는 좀 달라짐

이것은 array가 될거고 그 안에 object가 옴

path라고 적고, 이것은 문자열이 됨

그리고 component라고 적음

이것은 component가 됨

한번 해봄

첫번째 path는 "/"고, component는 Restaurants임

그리고 다른 것들도 똑같이 해줌

ConfirmEmail은 아직 안 할 거고, EditProfile도 아직 안 함

그리고 다음으로 /search가 있음

component는 Category가 됨

/restaurant/:id는 path고, component는 Restaurant임

이것은 clientRoutes가 됨

다음으로 commonRoutes라는 것을 만들건데, 여기에는 ConfirmEmail과 EditProfile route 두개가 옴

하지만 이렇게 적는 대신에 일단 path를 적음

이것을 object에 넣음

그리고 /Router는 지움

앞으로 이런 방식으로 할거고, 이렇게는 하지 않음

이런 방식으로 route를 render함

만약 role이 "Client"라면 ClientRoutes를 가져와서 map을 적음

그리고 여기서 route.component를 render함

그리고 key 부분은 index를 쓰거나, 아니면 이렇게 route.path를 적을 수 있음

이것은 유니크한 거라고 확신할 수 있음

그리고 여기 commonRoutes도 똑같이 써줌

이 부분은 common route들을 render 해줌

common route들은 /confirm과 /edit-profile 이 두개임

이 부분은 지움

왜냐하면 더 좋은 것을 만들었음

여기는 여전히 먹통임

하지만 /edit-profile로 들어가면 제대로 들어가짐

왜냐하면 commonRoutes를 render 했었음

하지만 아직 restaurant route는 없음

그러니 restaurant route 부분을 작업해봄

첫번째는 path: "/"이고, component는 아직 만들지 않았지만 MyRestaurants라고 적어줌

restaurant routes를 render함

client routes랑 owner routes랑 모두가 공유하는 common route를 작성했음

여기 MyRestaurants는 보다시피 아직 정의되지 않았음

그러니 빨리 만들어봄

우선 pages 디렉토리로 가서 새로운 폴더를 생성함(폴더명: owner)

그 안에 my-restaurants.tsx 파일을 생성함

React부터 import함

한번 가서 봄

logged-in-router.tsx 파일의 코드를 확인함

콘솔도 한번 보고, 에러가 없는지도 확인해봄

client category에 있는 것들을 하나도 사용하지 않았다는 경고문만 뜸

사용되지 않은 variables에 대한 내용들임

이정도는 괜찮음

사용되지 않은 변수들은 아직 신경 쓸 필요없음

restaurant routes를 만들었음

이제는 복붙이나 key 수정 같은 과정이 불필요한, 더 괜찮은 방법으로 route를 만들 수 있게 됐음

그런데 더 멋지게 할 수도 있음

renderer를 만들거나 다른 방법도 가능함

하지만 문제는 이 Switch 부분임

Switch의 자식들은 route여야만함

다른 component를 사용할 수는 없음

하지만 이대로 충분히 좋음

다음 시간에 봄

보면 알겠지만 이것은 my-restaurants라고 되어있음

그러니까 여기는 음식점 주인 입장에서 나의 음식점을 보고 싶을 때 오는 곳임

그런데 우리는 이런 기능을 아직 backend에 구현하지 않았음

backend에 만든 것을 보여줌

아주 짧지만 꼭 필요함

이 부분을 backend에 만들었음

다시 말하지만, 만들어놓고 그동안 까먹고 있었음

하지만 기본적으로 이것은 myRestaurants이고, myRestaurant을 return해주는 기능을 함

이 myRestaurant은 음식점 주인 본인이 소유한 음식점임

이것은 dto를 return해주는 query임

이것은 CoreOutput에서 extend하는 ObjectType임

아무튼 보면 다 이해가 됨

Role은 Owner니까 owner들만 이 resolver를 볼 수 있음

그리고 이것은 restaurantService에 있는 myRestaurants를 호출하고, myRestaurants는 이렇게 생겼음

myRestaurant는 인자로 owner를 받고, 이 owner를 가진 모든 음식점들을 찾음

그리고 해당 음식점들을 모두 return 해줌

그리고 다시 말하지만 이것은 한명의 owner가 복수의 음식점을 소유할 수 있도록 기획했기 때문에 일어난 일임

만약 하나의 계정당 하나의 음식점만 등록 가능하도록 만든다면 이런 것은 필요 없음

이런 query를 만들었으니까 backend 부분도 업데이트해줌

코드가 4~5줄 밖에 안되니까 쓰는데 그렇게 시간이 오래 걸리지도 않음

그저 해당 유저(Owner)의 음식점을 찾아주는 작업일뿐임

원한다면 me resolver를 사용하는 것도 가능함

왜냐하면 me에 음식점들이 있음

이것들이 내가 소유하는 음식점들임

이것을 사용할 수도 있음

하지만 이 경우 entities 폴더의 user.entity.ts에 들어가서 user를 받을 때마다 음식점들도 함께 받아지도록 restaurants eager를 만들어야함

하지만 이것은 별로라고 생각함

왜냐하면 이렇게 하면 매번 user를 받게 됨

use me라는 hook이 있음

아무튼 그것도 하나의 방법임 

이 relationship을 eager로 만들 수 있지만, database 입장에서 별로임

그냥 이렇게 restaurant.service랑 restaurants.resolvers를 만듦
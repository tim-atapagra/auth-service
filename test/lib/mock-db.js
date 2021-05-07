const mongodb = require("../../src/DB/mongodb");

class MockDB {
  /**
   * Wipes the test db so have a clean start for our tests
   *
   * @method reset
   */
  async reset() {
    const { client, db } = await mongodb.createConnection();
    await db.dropDatabase();
    await client.close();
  }
}

module.exports = new MockDB();

// test("POST /signup", async () => {
//     const testData = {
//       "userName":"testman","password":"testtimpagra", "email": "test@gmail.com", "phoneNumber":"4435005911"
//   }

//   const token = {
//     token: '41783449315886415591',
//     otp:'3esc23'
//   }
//     const user = await userService.create({...testData, ...token});

//     console.log('Created user ', user)

//     await supertest(app).post("/signup")
//       .expect(201)
//       .then((response) => {
//         // expect(response.body.length).toEqual(1);

//         console.log('Response ', response)

//         // Check data
//         expect(response.username).toBe(user.username);
//         expect(response.password).toBe(user.password);
//         expect(response.email).toBe(user.email);
//         expect(response.phone).toBe(user.phoneNumber);
//       });
//   });

//   // test("POST /api/posts", async () => {
//   //   const data = { title: "Post 1", content: "Lorem ipsum" };

//   //   await supertest(app).post("/api/posts")
//   //     .send(data)
//   //     .expect(200)
//   //     .then(async (response) => {
//   //       // Check the response
//   //       expect(response.body._id).toBeTruthy();
//   //       expect(response.body.title).toBe(data.title);
//   //       expect(response.body.content).toBe(data.content);

//   //       // Check data in the database
//   //       const post = await userService.findOne({ _id: response.body._id });
//   //       expect(post).toBeTruthy();
//   //       expect(post.title).toBe(data.title);
//   //       expect(post.content).toBe(data.content);
//   //     });
//   // });

//   // test("GET /api/posts/:id", async () => {
//   //   const post = await userService.create({ title: "Post 1", content: "Lorem ipsum" });

//   //   await supertest(app).get("/api/posts/" + post.id)
//   //     .expect(200)
//   //     .then((response) => {
//   //       expect(response.body._id).toBe(post.id);
//   //       expect(response.body.title).toBe(post.title);
//   //       expect(response.body.content).toBe(post.content);
//   //     });
//   // });

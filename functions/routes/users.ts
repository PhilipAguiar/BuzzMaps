import * as express from "express";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

type User = {
  id: string;
  displayName: string;
  icon: string;
};

const usersRouter = express.Router();

usersRouter.post("/", async (req: any, res) => {
  const user: User = req.body;

  await setDoc(doc(db, "UserList", user.id), user);
  res.status(200).send("User created and added to database!");
});

export default usersRouter;

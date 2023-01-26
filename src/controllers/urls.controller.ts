import { Request, Response } from "express";
import client from "../utils/dbCollection";
import { ObjectId } from "mongodb";
const urlsCollection = client.db("shortiify").collection("urls");

export const getAllToDos = async (req: Request, res: Response) => {
  const toDos = await urlsCollection.find({}).toArray();
  res.send(toDos);
};

export const createUrls = async (req: Request, res: Response) => {
  const data = req.body;
  const decodedId = req?.body?.user?.uid;
  const uid = req.query.uid;
  if (uid === decodedId) {
    const result = await urlsCollection.insertOne(data);
    if (result.acknowledged) {
      res.send({
        success: true,
        message: "Urls Added successfully",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

export const createToDo = async (req: Request, res: Response) => {
  const data = req.body;
  const decodedId = req?.body?.user?.uid;
  const uid = req.query.uid;
  if (uid === decodedId) {
    const result = await urlsCollection.insertOne(data);
    if (result.acknowledged) {
      res.send({
        success: true,
        message: "ToDos Added successfully",
      });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

export const deleteToDo = async (req: Request, res: Response) => {
  const todoId = req.query.todoId;
  const decodedId = req?.body?.user?.uid;
  const uid = req.query.uid;
  if (decodedId === uid) {
    const result = await urlsCollection.deleteOne({
      _id: new ObjectId(todoId as string),
    });
    if (result.acknowledged) {
      res.send({
        success: true,
        message: "ToDo Deleted successfully",
      });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

export const deleteToDoAdmin = async (req: Request, res: Response) => {
  const todoId = req.params.id;
  const result = await urlsCollection.deleteOne({
    _id: new ObjectId(todoId as string),
  });
  if (result.acknowledged) {
    res.send({
      success: true,
      message: "ToDo Deleted successfully",
    });
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

export const completeToDo = async (req: Request, res: Response) => {
  const decodedId = req?.body?.user?.uid;
  const uid = req.query.uid;
  const todoId = req.query.todoId;
  if (decodedId === uid) {
    const query = { _id: new ObjectId(todoId as string), };
    const updateDoc = {
      $set: { completed: true },
    };
    const result = await urlsCollection.updateOne(query, updateDoc);
    if (result.acknowledged) {
      res.send({ success: true, message: "ToDo is Completed" });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden Access." });
  }
};

export const getMyToDos = async (req: Request, res: Response) => {
  const decodedEmail = req?.body?.user?.email;
  const email = req.query.email;
  if (email === decodedEmail) {
    const myItems = await urlsCollection.find({ email: email }).toArray();
    res.send(myItems);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getMyToDosByTitle = async (req: Request, res: Response) => {
  const decodedEmail = req?.body?.user?.email;
  const email = req.query.email;
  const title = req.query.title;
  console.log(title, email, decodedEmail);
  if (email === decodedEmail) {
    const myItems = await urlsCollection
      .find
      ({ email: email, title: { $regex: title as string } })
      .toArray();
    res.status(200).send({ message: "Searched Result", success: true, myItems });
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getMyCompletedToDos = async (req: Request, res: Response) => {
  const decodedEmail = req?.body?.user?.email;
  const email = req.query.email;
  if (email === decodedEmail) {
    const myItems = await urlsCollection
      .find({ email: email, completed: true })
      .toArray();
    res.send(myItems);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const updateToDo = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const filter = { _id: new ObjectId(id as string), };
  const options = { upsert: true };
  const updatedDoc = {
    $set: body,
  };
  const toDoUpdated = await urlsCollection.updateOne(
    filter,
    updatedDoc,
    options
  );
  res.send(toDoUpdated);
};

import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import client from "../utils/dbCollection";
const appNameCollection = client.db("shortiify").collection("appName");

export const getAppName = async (req: Request, res: Response) => {
  const appID = {
    _id: new ObjectId("63d26663c0775e95c28ca164"),
  };
  const appName = await appNameCollection.findOne(appID);
  res.send(appName);
};

export const updateAppName = async (req: Request, res: Response) => {
  const name = req.body;
  const appID = {
    _id: new ObjectId("63d26663c0775e95c28ca164"),
  };
  const updateDoc = {
    $set: name,
  };
  const result = await appNameCollection.updateOne(appID, updateDoc);
  if (result.acknowledged) {
    res.send({ success: true, message: "Update app name successfully" });
  }
};

// add visitors to the website
export const addVisitor = async (req: Request, res: Response) => {
  // get the current visitors
  const appID = {
    _id: new ObjectId("63d26663c0775e95c28ca164"),
  };
  const appName = await appNameCollection.findOne(appID);
  const visitors = Number(appName?.visitors);
  const newVisitors = (prev: number) => {
    return prev += 1;
  };
  const updateDoc = {
    $set: { visitors: newVisitors(visitors) },
  };
  const result = await appNameCollection.updateOne(appID, updateDoc);
  if (result.acknowledged) {
    res.send({ success: true, message: "Update Visitors successfully", visitors: appName?.visitors });
  }
};

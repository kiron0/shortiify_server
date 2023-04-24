import { Request, Response, NextFunction } from "express";
import client from "../utils/dbCollection";
export const usersCollection = client.db("shortiify").collection("users");

export const VerifyDev = async (req: Request, res: Response, next: NextFunction) => {
          const requester = req?.body?.user?.email;
          const requesterAccount = await usersCollection.findOne({
                    email: requester,
          }) as any;
          if (requesterAccount.role === "developer") {
                    next();
          } else {
                    res.status(403).send({ message: "forbidden" });
          }
};

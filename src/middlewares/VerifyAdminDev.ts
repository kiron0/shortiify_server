import { Request, Response, NextFunction } from "express";
import client from "../utils/dbCollection";
export const usersCollection = client.db("shortiify").collection("users");

export const VerifyAdminDev = async (req: Request, res: Response, next: NextFunction) => {
          const requester = req.body?.user?.email;
          const requesterAccount = await usersCollection.findOne({
                    email: requester,
          }) as any;
          const userRoles = ["admin", "developer"];
          if (userRoles.includes(requesterAccount.role)) {
                    next();
          } else {
                    res.status(403).send({ message: "forbidden" });
          }
};

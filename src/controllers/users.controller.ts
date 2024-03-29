import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import client from "../utils/dbCollection";
const usersCollection = client.db("shortiify").collection("users" as string);

export const getUsers = async (req: Request, res: Response) => {
  const uid = req.query.uid;
  if (uid) {
    const users = await usersCollection.find({ uid: uid }).toArray();
    res.send(users);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const uid = req.query.uid;
  if (uid) {
    const user = await usersCollection.findOne({ uid: uid });
    res.send(user);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getUserUrlsByUid = async (req: Request, res: Response) => {
  let { uid, page, limit } = req.query as any;
  page = parseInt(page);
  limit = parseInt(limit);
  if (!page) page = 1;
  if (!limit) limit = 10;
  const skip = (page - 1) * limit;
  const sort = { createdAt: -1 };
  if (uid && page && limit) {
    const user = await usersCollection.findOne({ uid: uid });
    const urls = user?.urls?.reverse()?.slice(skip, skip + limit);
    const pageCount = Math.ceil(user?.urls?.length / limit);
    res.send({ urls: urls, totalPages: pageCount });
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

// get only the urls of the user by slug without uid
export const getUserUrlsBySlug = async (req: Request, res: Response) => {
  const slug = req.query?.slug?.toString() as string;
  const users = await usersCollection.find({}).toArray();
  const urls = users.map((user: any) => {
    return user.urls?.filter((url: any) => url?.slug === slug);
  });
  if (urls?.length > 0) {
    const newUrls = urls.flat();
    const finalUrls = newUrls.filter((url: any) => url?.slug === slug);
    if (finalUrls.length > 0) {
      const finalUrl = finalUrls[0];
      const newViews = (prev: number) => {
        return prev += 1;
      }
      const newUrl = await usersCollection.updateOne(
        { "urls.slug": slug },
        { $set: { "urls.$.views": newViews(finalUrl.views) } },
      );
      res.send(finalUrl);
    } else {
      res.status(404).send({ status: 404, message: "No url found" });
    }
  } else {
    res.status(404).send({ message: "No url found" });
  }
};


export const getUserUrlsWithoutUid = async (req: Request, res: Response) => {
  const userURL = req.body.url;
  const users = await usersCollection.find({}).toArray();
  const urls = users?.map((user: any) => {
    return user.urls?.filter((url: any) => url?.url === userURL);
  });
  if (urls?.length > 0) {
    // now convert the array of arrays to a single array
    const newUrls = urls?.flat();
    // now remove the empty arrays
    const finalUrls = newUrls?.filter((url: any) => url?.url === userURL);
    if (finalUrls.length > 0) {
      // now convert the array of objects to a single object
      const finalUrl = finalUrls[0];
      res.send(finalUrl);
    } else {
      res.status(404).send({ status: 404, message: "No url found" });
    }
  } else {
    res.status(404).send({ message: "No url found" });
  }
};

// update the slug of the url of the user
export const getSlug = async (req: Request, res: Response) => {
  const slug = req.query.slug as string;
  const id = req.query.id;
  const newSlug = req.body.slug;
  const userUrls = await usersCollection.find({}).toArray();
  const urls = userUrls.map((user: any) => {
    return user.urls?.filter((url: any) => url.slug == slug);
  });
  // remove undefined values
  const newUrls = urls.flat().filter((url: any) => url !== undefined);
  if (newUrls.length > 0) {
    res.send({ status: 200, message: "Slug already exists" });
  } else {
    const query = { "urls._id": id };
    const updateDoc = {
      $set: { "urls.$.slug": newSlug },
    };
    const result = await usersCollection.updateOne(query, updateDoc);
    if (result.acknowledged) {
      res.send({ success: true, message: "Slug updated successfully" });
    } else {
      res.send({ success: false, message: "Slug not updated" });
    }
  }
};

export const getUrl = async (req: Request, res: Response) => {
  const queryUrl = req.query.url as string;
  const id = req.query.id;
  const newUrl = req.body.url;
  const userUrls = await usersCollection.find({}).toArray();
  const urls = userUrls.map((user: any) => {
    return user.urls?.filter((url: any) => url.url == queryUrl);
  });
  const query = { "urls._id": id };
  const updateDoc = {
    $set: { "urls.$.url": newUrl },
  };
  const result = await usersCollection.updateOne(query, updateDoc);
  if (result.acknowledged) {
    res.send({ success: true, message: "Url updated successfully" });
  } else {
    res.send({ success: false, message: "Url not updated" });
  }
};

// delete a url from the user
export const deleteUrl = async (req: Request, res: Response) => {
  const uid = req.query.uid;
  const slug = req.query.slug;
  if (uid) {
    const user = await usersCollection.findOne({
      uid: uid,
    });
    const urls = user?.urls;
    // delete the url from the array
    const newUrls = urls?.filter((url: any) => url.slug !== slug);
    const query = { uid: uid };
    const updateDoc = {
      $set: { urls: newUrls },
    };
    const result = await usersCollection.updateOne(query, updateDoc);
    if (result.acknowledged) {
      res.send({ success: true, message: "Delete url successfully" });
    } else {
      res.send({ success: false, message: "Delete url failed" });
    }
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

// get only the urls of the user by id
export const getUserUrlsById = async (req: Request, res: Response) => {
  const id = req.query.id;
  if (id) {
    const user = await usersCollection.findOne({ _id: new ObjectId(id as any) });
    res.send(user?.urls);
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  let { page, limit } = req.query as any;
  page = parseInt(page);
  limit = parseInt(limit);
  if (!page) page = 1;
  if (!limit) limit = 10;
  const skip = (page - 1) * limit;
  const pages = Math.ceil((await usersCollection.countDocuments()) / limit);
  const users = await usersCollection.find({}).skip(skip).limit(limit).toArray();
  res.send({ users: users, totalPages: pages });
};

export const updateUser = async (req: Request, res: Response) => {
  const data = req.body;
  const uid = req.query.uid as string;
  const decodedID = req?.body?.user?.uid;
  const query = { uid: uid };
  const updateDoc = {
    $set: data,
  };
  if (decodedID === uid) {
    const result = await usersCollection.updateOne(query, updateDoc);
    if (result.acknowledged) {
      res.send({ success: true, message: "Update profile successfully" });
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden request" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  const filter = { email: user.email, uid: user.uid };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  const token = jwt.sign(
    { email: user.email, uid: user.uid },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
  res.send({ result, token });
};

export const deleteUser = async (req: Request, res: Response) => {
  const email = req.query.email;
  const result = await usersCollection.deleteOne({ email: email });
  res.send(result);
};

export const findAdmin = async (req: Request, res: Response) => {
  const email = req.query.email;
  if (email) {
    const user = await usersCollection.findOne({ email: email });
    const role = user?.role;
    if (role) {
      res.send({ success: true, userRole: role });
    } else {
      res.send({ success: false, userRole: role });
    }
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

export const roleChange = async (req: Request, res: Response) => {
  const email = req.body.email;
  const role = req.body.userRole;
  if (role === "user") {
    const filter = { email: email };
    const updateDoc = {
      $unset: { role: "" },
    };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send({ success: true, message: "Role changed successfully", result });
  } else {
    const filter = { email: email };
    const updateDoc = {
      $set: { role: role },
    };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send({ success: true, message: "Role changed successfully", result });
  }
};

// post urls to users
export const postUrls = async (req: Request, res: Response) => {
  const uid = req.query.uid;
  const urls = req.body.urls;
  const filter = { uid: uid };
  const updateDoc = {
    $push: { urls: urls },
  };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.send({
    success: true,
    message: "Update urls successfully",
    result,
  });
};

export const getUrlSbyEmail = async (req: Request, res: Response) => {
  const email = req.query.email;
  if (email) {
    const myItems = await usersCollection.find({ email: email }).toArray();
    res.send({ success: true, message: `ToDoS Found for ${email}`, result: myItems });
  } else {
    res.status(403).send({ message: "forbidden access" });
  }
};

// get only gmail users
export const getUsersMail = async (req: Request, res: Response) => {
  const users = await usersCollection.find({ email: { $regex: /@/ } }).toArray();
  if (users.length > 0) {
    res.send({ success: true, message: "Get gmail users successfully", result: users });
  } else {
    res.send({ success: false, message: "No gmail users found" });
  }
};
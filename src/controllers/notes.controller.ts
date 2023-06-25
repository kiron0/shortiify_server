import { Request, Response } from "express";
import client from "../utils/dbCollection";
const notesCollection = client.db("kNotes").collection("notes");

export const postNotes = async (req: Request, res: Response) => {
          const note = req.body;
          const result = await notesCollection.insertOne(note);
          if (result.acknowledged) {
                    res.send({ success: true, message: "Post note successfully" });
          }
};

export const getNotes = async (req: Request, res: Response) => {
          const notes = await notesCollection.find({}).toArray();
          res.send(notes);
};

export const getNote = async (req: Request, res: Response) => {
          const noteID = req.query.id as string;
          const note = await notesCollection.findOne({ id: noteID });
          res.send(note);
}

export const updateNote = async (req: Request, res: Response) => {
          const noteID = req.query.id as string;
          const note = req.body;
          const updateDoc = {
                    $set: note,
          };
          const result = await notesCollection.updateOne(
                    { id: noteID },
                    updateDoc
          );
          if (result.acknowledged) {
                    res.send({ success: true, message: "Update note successfully" });
          }
};

export const deleteNote = async (req: Request, res: Response) => {
          const noteID = req.query.id as string;
          const result = await notesCollection.deleteOne({ id: noteID });
          if (result.acknowledged) {
                    res.send({ success: true, message: "Delete note successfully" });
          }
};
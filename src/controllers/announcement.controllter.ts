import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Announcement } from "../entities/Announcement.entity";
import { upload } from "../middlewares/multerConfig";
import multer from "multer";

import { cloudinary } from "../middlewares/multerConfig";
import _ from "lodash";
import { CategoryAnnouncements } from "../entities/CategoryAnnouncements.entity";

export const createAnnouncement = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    if (req.file) {
      const {
        title,
        short_description,
        image_name,
        show_on_home,
        announcementCategory_id,
      } = req.body;
      const manager = getManager();
      const newAnnouncement = manager.create(Announcement, {
        title,
        short_description,
        image_name,
        show_on_home: show_on_home === "true" ? true : false,
        category: announcementCategory_id,
        image_link: req.file.path,
        cloudinary_public_id: req.file.filename,
      });
      let result = await manager.save(newAnnouncement);
      if (!result) {
        return res.status(500).json({
          message: "Error creating announcement",
        });
      }
      return res.status(200).json({
        message: "success",
        result: result,
      });
    } else {
      return res.status(500).json({
        message: "Error uploading file",
      });
    }
  });
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  const result = await manager.findOne(Announcement, id,{
    relations: ["category"],
  });
  if (!result) {
    return res.status(404).json({
      message: "Error getting announcement",
    });
  }
  return res.status(200).json({
    message: "success",
    result: result,
  });
};

export const getAllAnnouncement = async (req: Request, res: Response) => {
  const manager = getManager();

  let announcements = await manager.find(Announcement,{
    relations: ["category"],
  });
  if (announcements.length === 0) {
    return res.status(404).json({
      message: "Error getting announcements/no announcements found",
    });
  }
  return res.status(200).json({
    message: "success",
    announcements: announcements,
  });
};

export const updateAnnounceMentById = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { id } = req.params;
    const {
      title,
      short_description,
      image_name,
      show_on_home,
      announcementCategory_id,
    } = req.body;
    const manager = getManager();
    let announcement = await manager.findOne(Announcement, id);
    if (!announcement) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
      }
      return res.status(400).json({
        message: "Cannot find announcement",
      });
    }
    // if announcement found
    if (req.file) {
      let old_image_public_id = announcement.cloudinary_public_id;
      announcement.title = title;
      announcement.short_description = short_description;
      announcement.category = announcementCategory_id;
      announcement.image_name = image_name;
      announcement.show_on_home = show_on_home === "true" ? true : false;
      announcement.image_link = req.file.path;
      announcement.cloudinary_public_id = req.file.filename;
      let result = await manager.save(announcement);
      if (!result) {
        return res.status(500).json({
          message: "Error updating announcement",
        });
      }
      cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
      return res.status(200).json({
        message: "success",
        result: announcement,
      });
    } else {
      // if no file uploaded but data to be updated
      announcement.title = title;
      announcement.short_description = short_description;
      announcement.category = announcementCategory_id;
      announcement.show_on_home = show_on_home === "true" ? true : false;
      let result = await manager.save(announcement);
      if (!result) {
        return res.status(500).json({
          message: "Error updating announcement",
        });
      }
      return res.status(200).json({
        message: "success",
        result: announcement,
      });
    }
  });
};

export const deleteAnnouncementById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  let announcement = await manager.findOne(Announcement, id);
  if (!announcement) {
    return res.status(404).json({
      message: "Cannot find announcement",
    });
  }
  let old_image_public_id = announcement.cloudinary_public_id;
  let result = await manager.delete(Announcement, { id });

  if (!result) {
    return res.status(500).json({
      message: "Error deleting announcement",
    });
  }
  cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
  return res.status(200).json({
    message: "Announcement deleted",
  });
};

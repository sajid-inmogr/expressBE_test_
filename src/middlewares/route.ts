import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

// router imports
import { userRouter } from "../routes/userRouter";
import { homeRouter } from "../routes/homeRouter";
import { companyRouter } from "../routes/companyRouter";
import { teamRouter } from "../routes/teamRouter";
import { productsRouter } from "../routes/productsRouters";
import { clientRouter } from "../routes/clientRouter";
import { announcementRouter } from "../routes/announcementRouter";
import { contactusRouter } from "../routes/contactusRouter";
import { categoryProductsRouter } from "../routes/categoryProductsRouter";
import { categoryAnnouncementsRouter } from "../routes/categoryAnnouncementsRouter";

export const routes = (app: Application) => {
  app.use(cors());
  app.use(express.json());
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  // server static files in upload folder
  app.use("/", async (req: Request, res: Response) => {
    return res.status(200).json("hello world");
  });
  app.use("/uploads", express.static("uploads"));
  app.use("/api/users", userRouter); //routes of user admin
  // note reasons for using /api/admin/home instead of /api/home because these route will need admin authentication to access and better redability
  app.use("/api/admin/home", homeRouter); //routes of home"
  // app.use("/api/admin/about-us", aboutusRouter); //routes of about us
  app.use("/api/admin/mycompany", companyRouter);
  app.use("/api/admin/myteam", teamRouter);
  app.use("/api/admin/products", productsRouter);
  app.use("/api/admin/category-products", categoryProductsRouter);
  app.use("/api/admin/category-announcements", categoryAnnouncementsRouter);
  app.use("/api/admin/client", clientRouter);
  app.use("/api/admin/announcement", announcementRouter);
  app.use("/api/admin/contact-us", contactusRouter);
};

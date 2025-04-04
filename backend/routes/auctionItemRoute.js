import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addNewAuctionItem,
  getAllItems,
  getAuctionDetail,
  removeFromAuction,
  republishItem,
} from "../controllers/auctionItemController.js";
import express from "express";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  addNewAuctionItem
);
router.get("/allitems", getAllItems);
router.get("/auction/:id", isAuthenticated, getAuctionDetail);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  removeFromAuction
);

router.put("/item/republish/:id", isAuthenticated, isAuthorized, republishItem);

export default router;

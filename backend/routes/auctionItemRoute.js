import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addNewAuctionItem,
  getAllItems,
  getAuctionDetail,
  getMyAuctionItems,
  removeFromAuction,
  republishItem,
} from "../controllers/auctionItemController.js";
import express from "express";
import { trackCommissionStatus } from "../middlewares/trackConissionStatus.js";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  trackCommissionStatus,
  addNewAuctionItem
);
router.get("/allitems", getAllItems);
router.get("/auction/:id", isAuthenticated, getAuctionDetail);
router.get("/myitems",isAuthenticated,isAuthorized("Auctioneer"),getMyAuctionItems)
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  removeFromAuction
);

router.put("/item/republish/:id", isAuthenticated, isAuthorized("Auctioneer"), republishItem);

export default router;

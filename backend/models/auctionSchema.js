// import mongoose from "mongoose"

// const auctionSchema = new mongoose.Schema({
//     title : String,
//     discription : String,
//     startingBid : Number,
//     category:String,
//     condition :{
//         type:String,
//         enum : ["new","User"],
//     },
//     currentBid : {type : Number , default:0},
//     startTime : String,
//     endTime : String,
//     image : {
//         public_id : {
//             type : String,
//             required:true
//     },
//     url:{
//         type:String,
//         required :true
//     }
//     },
//     createdBy :{
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "USer",
//         required : true
//     },
//     bids: [
//         {
//             userId : {
//                 type : mongoose.Schema.Types.ObjectId,
//                 ref :"Bid"
//             },
//             userName : String,
//             profileImage : String,
//             amount : Number
//         }
//     ],
//     highestBidder : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "User",
//     },
//     commissionCalculated :{
//         type : Boolean,
//         default : false
//     },
//     createdAt: {
//         type : Date,
//         default : Date.now
//     },
// });

// export const Auction = mongoose.model("Auction", auctionSchema)
// import mongoose from "mongoose"
// const auctionSchema = new mongoose.Schema({
//     title: String,
//     description: String,  // Corrected the typo
//     startingBid: Number,
//     category: String,
//     condition: {
//       type: String,
//       enum: ["new", "Used"],
//     },
//     currentBid: { type: Number, default: 0 },
//     startTime: String,
//     endTime: String,
//     image: {
//       public_id: {
//         type: String,
//         required: true,
//       },
//       url: {
//         type: String,
//         required: true,
//       },
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     bids: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Bid",
//         },
//         userName: String,
//         profileImage: String,
//         amount: Number,
//       },
//     ],
//     highestBidder: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     commissionCalculated: {
//       type: Boolean,
//       default: false,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   });
  
//   export const Auction = mongoose.model("Auction", auctionSchema);
  
import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startingBid: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        enum: ["new", "Used"],
        required: true,
    },
    currentBid: {
        type: Number,
        default: 0,
    },
    startTime: {
        type: Date,  // Changed from String to Date
        required: true,
    },
    endTime: {
        type: Date,  // Changed from String to Date
        required: true,
    },
    image: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to User model for the creator
        required: true,
    },
    bids: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",  // Changed from Bid to User reference
                required: true,
            },
            userName: {
                type: String,
                required: true,
            },
            profileImage: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    ],
    highestBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to User model
    },
    commissionCalculated: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,  // Flag for deleted auctions
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Use a virtual property to exclude deleted auctions when querying
auctionSchema.virtual("isActive").get(function () {
  return !this.isDeleted && new Date(this.endTime) > Date.now();
});

export const Auction = mongoose.model("Auction", auctionSchema);

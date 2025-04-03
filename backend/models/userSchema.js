// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const userSchema = new mongoose.Schema({
//   userName: {
//     type: String,
//     minlength: [3, "Usrname must contain at least 3 characters."],
//     maxLength: [40, "Username Cannot exceed 40 characters ."],
//   },
//   password: {
//     type: String,
//     selected: false,
//     required: [true, "Password is required."],
//     minlength: [6, "Password must be at least 6 characters long."],
//     maxLength: [32, "password cannot exceed 32 characters"],
//   },
//   email: String,
//   address: String,
//   phone: {
//     type: String,
//     required: [true, "Phone number is required."],
//     match: [/^\d{10}$/, "Please enter a valid 10-digit phone number."],
//   },
//   profileImage: {
//     public_id: {
//       type: String,
//       required: true,
//     },
//   },
//   paymentMethods: {
//     bankTransfer: {
//       bankAccountNumber: String,
//       bankAccountName: String,
//       bankName: String,
//     },
//     RazorPay: {
//       rajorPayAccountNuber: Number,
//     },
//     payPal: {
//       paypalEmail: String,
//     },
    
//   },
//   role: {
//     type: String,
//     enum: ["Auctioneer", "Bider", "Super Admin"],
//   },
//   unpaidCommission: {
//     type: Number,
//     default: 0,
//   },
//   auctionWon: {
//     type: Number,
//     default: 0,
//   },
//   moneySpent: {
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const user = mongoose.model("User", userSchema);



// userSchema.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  // Your schema definition here...
  userName: {
    type: String,
    minlength: [3, "Usrname must contain at least 3 characters."],
    maxLength: [40, "Username Cannot exceed 40 characters ."],
  },
  password: {
    type: String,
    selected: false,
    required: [true, "Password is required."],
    minlength: [6, "Password must be at least 6 characters long."],
    maxLength: [32, "password cannot exceed 32 characters"],
  },
  email: String,
  address: String,
  phone: {
    type: String,
    required: [true, "Phone number is required."],
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number."],
  },
  profileImage: {
    public_id: {
      type: String,
      required: true,
    },
  },
  paymentMethods: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    RazorPay: {
      rajorPayAccountNuber: Number,
    },
    payPal: {
      paypalEmail: String,
    },
  },
  role: {
    type: String,
    enum: ["Auctioneer", "Bider", "Super Admin"],
  },
  unpaidCommission: {
    type: Number,
    default: 0,
  },
  auctionWon: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();  // Skip hashing if the password hasn't been modified
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10); // Hash the password with salt rounds
    this.password = hashedPassword;
    console.log("Password hashed:", this.password);  // Log the hashed password (for debugging)
    next();  // Proceed to save the user
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);  // Pass the error to the next middleware
  }
});

userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password)
}


userSchema.methods.generateJsonWebToken = async function () {
  return jwt.sign({id : this.id},process.env.JWT_SECRET_KEY,{
    expiresIn : process.env.JWT_EXPIRE
  })
}

const User = mongoose.model("User", userSchema);

export default User; // Change to default export


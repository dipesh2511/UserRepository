export const UserSchema = {
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 20,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 20,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  otp: {
    type: String,
    minLength: 6,
    maxLength: 6,
    default: null,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
    select: false,
  },
  resetPasswordToken:{
    type: String,
    select: false,
  }
};

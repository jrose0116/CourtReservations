import { users } from "../config/mongoCollections.js";
import { validId, validStr, validStrArr, validNumber } from "../validation.js";

const exportedMethods = {
  async createReview(revieweeId, reviewerId, rating, comment) {
    //
  },
  async deleteReview(reviewId) {
    //
  },
  async updateOverallRating(userId) {
    //
  },
};

export default exportedMethods;

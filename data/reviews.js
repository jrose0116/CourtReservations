import { users } from "../config/mongoCollections.js";
import { validId, validStr, validStrArr, validNumber } from "../validation.js";

const exportedMethods = {
	async createReview(revieweeId, reviewerId, rating, comment) {
		try {
			revieweeId = validId(revieweeId);
			reviewerId = validId(reviewerId);
		} catch (e) {
			throw (
				"Error (data/reviews.js :: createReview(revieweeId, reviewerId, rating, comment)):" +
				e
			);
		}

		const usersCollection = await users();
		const reviewee = await usersCollection.findOne({
			_id: new ObjectId(revieweeid),
		});

		if (reviewee === null)
			throw "Error (data/reviews.js :: createReview(revieweeId, reviewerId, rating, comment)): Reviewed user not found";

		reviews = reviewee.reviews;
		for (let i of reviews) {
			if (i.reviewee_id.toString() == revieweeId) {
				throw "Error (data/reviews.js :: createReview(revieweeId, reviewerId, rating, comment)): User already contains review from user (delete review to create a new one)";
			}
		}

		const reviewer = await usersCollection.findOne({
			_id: new ObjectId(reviewerId),
		});

		if (reviewee === null)
			throw "Error (data/reviews.js :: createReview(revieweeId, reviewerId, rating, comment)): Review poster not found";

		try {
			rating = validNumber(rating, "Rating", false, 1, 5);
			comment = validStr(comment, "Comment");
		} catch (e) {
			throw (
				"Error (data/reviews.js :: createReview(revieweeId, reviewerId, rating, comment)):" +
				e
			);
		}

		date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();

		month = ("" + month).length == 1 ? "0" + month : month;
		day = ("" + day).length == 1 ? "0" + day : day;

		dateString = `${month}/${day}/${year}`;

		let reviewObject = {
			_id: new ObjectId(),
			reviewerUsername: reviewee._id.toString(),
			revieweeUsername: reviewer._id.toString(),
			reviewer_id: reviewerId,
			reviewee_id: revieweeId,
			rating: rating,
			comment: comment,
			date: dateString,
		};

		reviews.push(reviewObject);

		const updatedInfo = await usersCollection.findOneAndUpdate(
			{ _id: new ObjectId(revieweeId) },
			{ $set: { reviews: reviews } },
			{ returnDocument: "after" }
		);

		if (updatedInfo.lastErrorObject.n === 0)
			throw "Error (data/reviews.js :: createReview(revieweeId, reviewerId, rating, comment)): Could not update user";

		reviewObject._id = reviewObject._id.toString();
		await updateOverallRating(revieweeId);

		return reviewObject;
	},
	async deleteReview(reviewId) {
		try {
			reviewId = validId(reviewId);
		} catch (e) {
			throw "Error (data/reviews.js :: deleteReview(reviewId)): " + e;
		}

		const usersCollection = await users();
		const user = await usersCollection.findOne({
			reviews: { $elemMatch: { _id: new ObjectId(reviewId) } },
		});

		if (user == null)
			throw "Error (data/reviews.js :: deleteReview(reviewId)): Review not found";

		let found = false;
		let reviews = user.reviews;
		for (let i in reviews) {
			if (reviews[i]._id.toString() == reviewId) {
				reviews[i]._id = reviews[i]._id.toString();
				reviews.splice(i, 1);
				found = true;
			}
		}

		if (!found)
			throw "Error (data/reviews.js :: deleteReview(reviewId)): Review not found";

		const updatedInfo = await usersCollection.findOneAndUpdate(
			{ _id: user._id },
			{ $set: { reviews: reviews } },
			{ returnDocument: "after" }
		);

		if (updatedInfo.lastErrorObject.n === 0)
			throw "Error (data/reviews.js :: deleteReview(reviewId)): Could not update user";

		await updateOverallRating(user._id.toString());

		updatedInfo.value._id = updatedInfo.value._id.toString();
		for (let i of updatedInfo.value.reviews) {
			i._id = i._id.toString();
		}

		return updatedInfo.value;
	},
	async updateOverallRating(userId) {
		try {
			userId = validId(userId);
		} catch (e) {
			throw "Error (data/reviews.js :: updateOverallRating(userId)): " + e;
		}

		const usersCollection = await users();
		const reviewee = await usersCollection.findOne({
			_id: new ObjectId(userId),
		});

		if (reviewee === null)
			throw "Error (data/reviews.js :: updateOverallRating(userId)): User not found";

		reviews = reviewee.reviews;
		let res = 0;
		for (let i of reviews) {
			res += i.rating;
		}
		res = reviews.length == 0 ? 0 : res / reviews.length;

		const updatedInfo = await usersCollection.findOneAndUpdate(
			{ _id: new ObjectId(userId) },
			{ $set: { overallRating: res } },
			{ returnDocument: "after" }
		);

		if (updatedInfo.lastErrorObject.n === 0)
			throw "Error (data/reviews.js :: updateOverallRating(userId)): Could not update user";

		updatedInfo.value._id = updatedInfo.value._id.toString();
		for (let i of updatedInfo.value.reviews) {
			i._id = i._id.toString();
		}

		return updatedInfo.value;
	},
};

export default exportedMethods;

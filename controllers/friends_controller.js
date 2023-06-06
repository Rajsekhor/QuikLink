const User = require('../models/user');
const Friendship = require('../models/friendship');

async function addFriend(req, res) {
  try {
    const { fromUserId, toUserId } = req.body;

    // Check if the user IDs are valid
    if (!fromUserId || !toUserId) {
      return res.status(400).json({ message: 'Invalid user IDs' });
    }

    // Check if the users are already friends
    const existingFriendship = await Friendship.findOne({
      $or: [
        { from_user: fromUserId, to_user: toUserId },
        { from_user: toUserId, to_user: fromUserId },
      ],
    });

    if (existingFriendship) {
      return res.status(400).json({ message: 'Users are already friends' });
    }

    // Create a new friendship object
    const friendship = new Friendship({
      from_user: fromUserId,
      to_user: toUserId,
    });

    // Save the friendship to the database
    await friendship.save();

    // Update the friendships array for both users
    await User.findByIdAndUpdate(fromUserId, {
      $push: { friendships: friendship._id },
    });
    await User.findByIdAndUpdate(toUserId, {
      $push: { friendships: friendship._id },
    });

    res.redirect("back");
  } catch (error) {
    console.error('Error adding friend:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function removeFriend(req, res) {
  try {
    const { fromUserId, toUserId } = req.body;

    // Check if the user IDs are valid
    if (!fromUserId || !toUserId) {
      return res.status(400).json({ message: 'Invalid user IDs' });
    }

    // Find the friendship to be removed
    const friendship = await Friendship.findOneAndDelete({
      from_user: fromUserId,
      to_user: toUserId,
    });

    if (!friendship) {
      return res.status(400).json({ message: 'Friendship not found' });
    }

    // Update the friendships array for both users
    await User.findByIdAndUpdate(fromUserId, {
      $pull: { friendships: friendship._id },
    });
    await User.findByIdAndUpdate(toUserId, {
      $pull: { friendships: friendship._id },
    });

    res.redirect("back");
  } catch (error) {
    console.error('Error removing friend:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addFriend,
  removeFriend,
};

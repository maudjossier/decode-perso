export default function Wishlist (wishlist = [], action) {
  if (action.type === "addWishlist") {
    return action.wishlist;
  } else if (action.type === "deleteArticle") {
    var wishlistCopy = [...wishlist];
    var position = action.index;
    if (position != null) {
      wishlistCopy.splice(position, 1);
    }
    return wishlistCopy;
  } else if (action.type === "deleteWishlist") {
    console.log("wishlist vidée");
    wishlistCopy = [];
    return wishlistCopy;
  } else {
    return wishlist;
  }
}

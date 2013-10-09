/*
 * Operation Model
 * ===============
 * 
 * Describes one step in an edit script.
 *
 * Of the form:
 * {
 *   treeUrl:  String -- The URL of the tree being operated upon
 *   treeType: String -- The type of the tree being operated upon
 *   path:     String -- The selector into <treeUrl>
 *   operator: String -- The operation being performed
 *   operand:  Array[String] -- Arlist for <operator>
 * }
 *
 *
 * Valid Tree Types
 * ================
 *
 * wild
 * ----
 * An HTML tree in the wild; no previous integration in system.
 *
 * jekyll-github
 * -------------
 * A Github hosted Jekyll instance
 *
 * filesystem
 * ----------
 * Just plain HTML files
 *
 *
 * Valid Operators
 * ===============
 *
 * edit 
 * ----
 * User modified a primitive value.
 * - Operand 1: new_value : String
 *
 * list-add
 * --------
 * User duplicates n^th item of list of n
 *
 * list-del
 * --------
 * User deletes the i^th item from a list
 * - Operand 1: i : Int
 *
 * list-reorder
 * ------------
 * Moves list item i to list item j, with previous j becomming j+1
 * - Operand 1: i : Int
 * - Operand 2: j : Int
 * 
 */

var Operation = mongoose.Schema({
  treeUrl: { type: String, required: true, unique: true, trim: true },
  password: { type: String, set: encodePassword, required: true }
});



/*
 * Operation Model
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
 * Valid treeTypes
 * ===============
 *
 * wild
 * ----
 * An HTML tree in the wild; no previous integration in system.
 *
 * Todo:
 *  - jekyll-github
 *  - filesystem
 *
 * Valid operators
 * ===============
 *
 * edit 
 * ----
 * User modified a primitive value.
 * Operand: [ <new_value : String> ]
 *
 * Todo:
 *  - push (pushes a new element on a list)
 *  - delete (removes an element on a list)
 *  - reorder (moves element i to j)
 * 
 */

var Operation = mongoose.Schema({
  treeUrl: { type: String, required: true, unique: true, trim: true },
  password: { type: String, set: encodePassword, required: true }
});


